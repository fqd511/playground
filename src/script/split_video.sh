#!/bin/bash

# 默认阈值 800MB
THRESHOLD=$((800 * 1024 * 1024))

# 1. 获取输入文件
INPUT_FILE="$1"

# 如果没有传入参数，寻找当前目录下第一个视频文件 (mkv, mp4, avi)
if [ -z "$INPUT_FILE" ]; then
    INPUT_FILE=$(ls *.mkv *.mp4 *.avi 2>/dev/null | head -n 1)
fi

# 检查文件是否存在
if [ ! -f "$INPUT_FILE" ]; then
    echo "错误: 未找到视频文件。"
    exit 1
fi


# 2. 获取 Metadata
# 获取文件大小 (Bytes)
FILE_SIZE=$(ffprobe -v error -show_entries format=size -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
# 获取总帧数
TOTAL_FRAMES=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
FILENAME=$(basename -- "$INPUT_FILE")
FILENAME_NO_EXT="${FILENAME%.*}"

echo "正在处理: $FILENAME"
echo "视频大小: $((FILE_SIZE / 1024 / 1024)) MB | 总帧数: $TOTAL_FRAMES"

# 3. 计算切分份数
# 向上取整计算份数 (份数 = 总大小 / 阈值)
NUM_PARTS=$(( (FILE_SIZE + THRESHOLD - 1) / THRESHOLD ))
if [ "$NUM_PARTS" -le 1 ]; then
    echo "文件大小未超过阈值，仅执行格式转换..."
    NUM_PARTS=1
fi

# 4. 计算切分帧点
FRAME_STEP=$(( TOTAL_FRAMES / NUM_PARTS ))
SEGMENT_FRAMES=""
for ((i=1; i<NUM_PARTS; i++)); do
    POINT=$(( i * FRAME_STEP ))
    SEGMENT_FRAMES="${SEGMENT_FRAMES}${POINT},"
done
SEGMENT_FRAMES=${SEGMENT_FRAMES%,*} # 去掉末尾逗号

# 5. 执行 FFmpeg 切分并转码为 MP4
echo "开始处理并转换为 MP4 格式..."

# 

# 说明：
# -c:v copy: 视频流直接拷贝（无损、极速）
# -c:a aac: 音频转为 AAC（确保在 MP4 容器中的兼容性）
# -sn: 禁用字幕（MKV 的特殊字幕通常不兼容 MP4，如需保留需特殊处理）
# -movflags +faststart: 优化 MP4 播放加载速度

ffmpeg -i "$INPUT_FILE" \
    -c:v copy \
    -c:a aac \
    -sn \
    -map 0:v -map 0:a? \
    -f segment \
    -segment_frames "$SEGMENT_FRAMES" \
    -segment_start_number 1 \
    -reset_timestamps 1 \
    -movflags +faststart \
    "${FILENAME_NO_EXT}_part%d.mp4"

echo "---------------------------------------"
echo "处理完成！"
echo "输出文件: ${FILENAME_NO_EXT}_part1.mp4 ... ${FILENAME_NO_EXT}_part${NUM_PARTS}.mp4"
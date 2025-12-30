#!/bin/bash

# 默认阈值 800MB (单位: Bytes)
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

echo "正在处理文件: $INPUT_FILE"

# 2. 获取 Metadata
# 获取文件大小 (Bytes)
FILE_SIZE=$(ffprobe -v error -show_entries format=size -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
# 获取总帧数
TOTAL_FRAMES=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
# 获取时长 (秒)
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
# 获取文件名和后缀
FILENAME=$(basename -- "$INPUT_FILE")
EXTENSION="${FILENAME##*.}"
FILENAME_NO_EXT="${FILENAME%.*}"

echo "视频大小: $((FILE_SIZE / 1024 / 1024)) MB"
echo "总帧数: $TOTAL_FRAMES"
echo "总时长: $DURATION 秒"

# 3. 计算切分份数
# 向上取整计算份数 (份数 = 总大小 / 阈值)
NUM_PARTS=$(( (FILE_SIZE + THRESHOLD - 1) / THRESHOLD ))

if [ "$NUM_PARTS" -le 1 ]; then
    echo "文件大小未超过阈值，无需切分。"
    exit 0
fi

echo "计算结果: 将切分为 $NUM_PARTS 份"

# 4. 计算每一份的帧数间隔并生成切分点列表
FRAME_STEP=$(( TOTAL_FRAMES / NUM_PARTS ))
SEGMENT_FRAMES=""

for ((i=1; i<NUM_PARTS; i++)); do
    POINT=$(( i * FRAME_STEP ))
    if [ $i -eq 1 ]; then
        SEGMENT_FRAMES="$POINT"
    else
        SEGMENT_FRAMES="$SEGMENT_FRAMES,$POINT"
    fi
done

# 5. 执行 FFmpeg 切分
echo "开始切分..."

# 根据格式决定是否添加 faststart (主要针对 mp4)
EXTRA_FLAGS=""
if [ "$EXTENSION" = "mp4" ]; then
    EXTRA_FLAGS="-movflags +faststart"
fi

ffmpeg -i "$INPUT_FILE" \
    -c copy \
    -map 0 \
    -f segment \
    -segment_frames "$SEGMENT_FRAMES" \
    -segment_start_number 1 \
    -reset_timestamps 1 \
    $EXTRA_FLAGS \
    "${FILENAME_NO_EXT}_part%d.${EXTENSION}"

echo "处理完成！切分后的文件名为: ${FILENAME_NO_EXT}_partX.${EXTENSION}"
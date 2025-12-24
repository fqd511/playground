"""
Telegram 频道消息标签批量修复脚本

如何运行:
1. 安装 uv (如果尚未安装): https://astral.sh/uv
2. 获取 API_ID 和 API_HASH: https://my.telegram.org
3. 在下方配置区域填写 Token、频道 ID 和标签信息
4. 运行命令: uv run --with telethon python main.py

注意: 
- 若修改非 Bot 发送的旧消息，需去掉 .start() 中的 bot_token 改用个人号登录。
- 私有频道 ID 必须以 -100 开头。
"""

import asyncio
from telethon import TelegramClient, errors

# ================= 配置区域 =================

API_ID = 12345678           # 替换为你的 API ID (数字)
API_HASH = 'your_api_hash'  # 替换为你的 API Hash
BOT_TOKEN = 'your_bot_token' 

# 私有频道 ID 说明:
# 链接 https://t.me/c/123456789/100 中的数字是 123456789
# 脚本中必须写成数字格式，且前面补上 -100
CHANNEL_ID = -100123456789  

# 消息 ID 范围 (可在消息链接末尾找到)
START_ID = 1000   
END_ID = 2000     

# 标签替换配置
WRONG_TAG = '#错误的标签'
CORRECT_TAG = '#正确的标签'

# 安全设置
DRY_RUN = True      # True: 只打印不修改; False: 执行实际修改
BATCH_SIZE = 100    # 分批获取消息的数量
# ===========================================

async def main():
    print(f"正在连接 Telegram... 目标频道: {CHANNEL_ID}")
    
    # 初始化客户端
    client = TelegramClient('tag_fixer_session', API_ID, API_HASH)
    
    # 修复 TypeError: 使用 await client.start() 处理异步上下文
    # 如果 Bot 权限不足修改旧消息，请删除 bot_token=BOT_TOKEN 改为个人登录
    async with await client.start(bot_token=BOT_TOKEN) as client:
        try:
            # 获取频道实体 (私有频道需确保 Bot 是管理员且 ID 包含 -100)
            entity = await client.get_entity(CHANNEL_ID)
            print(f"已连接频道: {entity.title}")
        except Exception as e:
            print(f"无法定位频道: {e}\n请确认 ID 格式为 -100xxxx 且 Bot 已加入频道。")
            return

        all_ids = list(range(START_ID, END_ID + 1))
        print(f"开始处理 ID 范围: {START_ID} -> {END_ID} (总计 {len(all_ids)} 个)")

        for i in range(0, len(all_ids), BATCH_SIZE):
            batch_ids = all_ids[i : i + BATCH_SIZE]
            try:
                # 批量抓取消息，不存在的 ID 会返回 None
                messages = await client.get_messages(entity, ids=batch_ids)
            except errors.RpcError as e:
                print(f"获取批次 {i} 失败: {e}")
                continue

            for msg in messages:
                if not msg or not msg.text:
                    continue

                if WRONG_TAG in msg.text:
                    new_text = msg.text.replace(WRONG_TAG, CORRECT_TAG)
                    
                    if DRY_RUN:
                        print(f"[待修改] ID {msg.id}: {msg.text[:20]}... -> {CORRECT_TAG}")
                    else:
                        try:
                            # 尝试编辑消息
                            await msg.edit(new_text)
                            print(f"[成功] ID {msg.id} 已修正")
                            # 频率限制保护: 每次修改停顿 1 秒
                            await asyncio.sleep(1)
                        except errors.MessageNotModifiedError:
                            pass
                        except errors.MessageAuthorRequiredError:
                            print(f"[权限错误] ID {msg.id}: Bot 无法修改此消息(可能太旧或非 Bot 发送)")
                        except Exception as e:
                            print(f"[失败] ID {msg.id}: {e}")
            
            # 批次间额外停顿，防止 FloodWait
            if not DRY_RUN:
                await asyncio.sleep(2)

        print("\n任务结束。")

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n用户停止运行。")
#!/bin/bash
# 设置定时任务脚本
# 用法: ./scripts/setup-cron.sh

echo "🚀 设置 daily-push-web 定时任务..."

# 获取项目绝对路径
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "📁 项目目录: $PROJECT_DIR"

# 创建 cron 任务
# 9:30 执行数据生成和同步
# 10:00 执行第二次同步（兜底）
# 每 15 分钟执行健康检查
CRON_JOBS="# daily-push-web 数据生成和同步
30 9 * * * cd $PROJECT_DIR && npm run skill >> $PROJECT_DIR/logs/skill.log 2>&1
0 10 * * * cd $PROJECT_DIR && npm run skill >> $PROJECT_DIR/logs/skill.log 2>&1
*/15 * * * * cd $PROJECT_DIR && npm run health:fix >> $PROJECT_DIR/logs/health.log 2>&1
"

# 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

# 输出建议的 cron 配置
echo ""
echo "📋 请手动添加以下定时任务（运行 crontab -e）："
echo "=========================================="
echo "$CRON_JOBS"
echo "=========================================="
echo ""
echo "💡 或者运行以下命令自动安装:"
echo "(crontab -l 2>/dev/null; echo '$CRON_JOBS') | crontab -"
echo ""
echo "⚠️ 注意:"
echo "   - 确保 node 和 npm 在 PATH 中"
echo "   - 首次运行前请先执行: npm run skill"
echo "   - 日志文件保存在: $PROJECT_DIR/logs/"
echo ""
echo "📚 可用命令:"
echo "   npm run skill           # 生成并同步数据"
echo "   npm run skill:generate  # 仅生成数据"
echo "   npm run skill:sync      # 仅同步数据"
echo "   npm run health          # 健康检查"
echo "   npm run health:fix      # 健康检查并修复"

#!/usr/bin/env python3
"""
每日推送套件健康检查脚本

检查每日三轮推送任务的运行状态
"""

import json
import sys
import argparse
from datetime import datetime

# 监控任务配置
MONITORED_JOBS = {
    "7d71919d-15fe-46b3-a5da-71c9a335df7b": {
        "name": "每日三轮推送",
        "schedule": "9:00 daily",
        "rounds": ["AI热点", "万代Hot Toys", "游戏折扣"]
    }
}

# 阈值配置
TIMEOUT_WARNING_MS = 240000  # 4分钟警告
TIMEOUT_CRITICAL_MS = 300000  # 5分钟严重
MAX_CONSECUTIVE_ERRORS = 1


def format_duration(ms):
    """格式化毫秒为可读时间"""
    if not ms:
        return "未知"
    if ms < 1000:
        return f"{ms}ms"
    elif ms < 60000:
        return f"{ms//1000}s"
    else:
        return f"{ms//60000}m{(ms%60000)//1000}s"


def format_timestamp(ms):
    """格式化时间戳"""
    if not ms:
        return "从未"
    dt = datetime.fromtimestamp(ms / 1000)
    return dt.strftime("%m-%d %H:%M")


def check_job_health(job_id, job_info, job_data):
    """检查单个任务健康状态"""
    if not job_data:
        return {
            "status": "error",
            "icon": "🔴",
            "message": "任务数据缺失",
            "suggestion": "检查任务是否存在"
        }
    
    state = job_data.get("state", {})
    enabled = job_data.get("enabled", False)
    last_status = state.get("lastStatus", "unknown")
    last_duration = state.get("lastDurationMs", 0)
    consecutive_errors = state.get("consecutiveErrors", 0)
    last_error = state.get("lastError", "")
    last_run = state.get("lastRunAtMs")
    
    # 严重：任务禁用
    if not enabled:
        return {
            "status": "critical",
            "icon": "🔴",
            "message": "任务已禁用",
            "last_run": format_timestamp(last_run),
            "duration": format_duration(last_duration),
            "suggestion": "使用 `cron update --job-id <id> --patch '{\"enabled\":true}'` 重新启用"
        }
    
    # 严重：连续失败
    if consecutive_errors >= MAX_CONSECUTIVE_ERRORS:
        return {
            "status": "critical",
            "icon": "🔴",
            "message": f"连续{consecutive_errors}次失败",
            "last_run": format_timestamp(last_run),
            "duration": format_duration(last_duration),
            "error": last_error,
            "suggestion": f"检查错误原因，手动重试: `cron run --job-id {job_id} --run-mode force`"
        }
    
    # 严重：上次运行失败
    if last_status == "error":
        return {
            "status": "critical",
            "icon": "🔴",
            "message": "上次运行失败",
            "last_run": format_timestamp(last_run),
            "duration": format_duration(last_duration),
            "error": last_error,
            "suggestion": f"错误: {last_error}，建议手动重试"
        }
    
    # 警告：运行时间较长
    if last_duration > TIMEOUT_WARNING_MS:
        return {
            "status": "warning",
            "icon": "🟡",
            "message": f"运行时间较长 ({format_duration(last_duration)})",
            "last_run": format_timestamp(last_run),
            "duration": format_duration(last_duration),
            "suggestion": "监控运行时间，可能接近超时阈值"
        }
    
    # 正常
    return {
        "status": "ok",
        "icon": "🟢",
        "message": "运行正常",
        "last_run": format_timestamp(last_run),
        "duration": format_duration(last_duration),
        "suggestion": None
    }


def generate_report(results):
    """生成健康报告"""
    lines = [
        "📊 每日推送套件健康报告",
        f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        ""
    ]
    
    critical_count = sum(1 for r in results.values() if r["status"] == "critical")
    warning_count = sum(1 for r in results.values() if r["status"] == "warning")
    
    # 汇总
    if critical_count > 0:
        lines.append(f"⚠️ 发现 {critical_count} 个严重问题")
    elif warning_count > 0:
        lines.append(f"⚡ 发现 {warning_count} 个警告")
    else:
        lines.append("✅ 每日推送套件运行正常")
    lines.append("")
    
    # 详情
    for job_id, result in results.items():
        job_name = MONITORED_JOBS.get(job_id, {}).get("name", job_id[:8])
        lines.append(f"{result['icon']} {job_name}")
        lines.append(f"   状态: {result['message']}")
        if result.get('last_run'):
            lines.append(f"   上次运行: {result['last_run']} | 耗时: {result['duration']}")
        if result.get('error'):
            lines.append(f"   错误: {result['error']}")
        if result.get('suggestion'):
            lines.append(f"   建议: {result['suggestion']}")
        lines.append("")
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description='每日推送套件健康检查')
    parser.add_argument('--file', '-f', help='JSON文件路径')
    args = parser.parse_args()
    
    # 读取输入
    try:
        if args.file:
            with open(args.file) as f:
                data = json.load(f)
        else:
            data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"❌ JSON解析错误: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 读取输入失败: {e}")
        sys.exit(1)
    
    # 构建任务查找表
    jobs_lookup = {}
    if isinstance(data, dict) and "jobs" in data:
        jobs_list = data["jobs"]
        if isinstance(jobs_list, list):
            jobs_lookup = {j["id"]: j for j in jobs_list}
        elif isinstance(jobs_list, dict):
            jobs_lookup = jobs_list
    elif isinstance(data, list):
        jobs_lookup = {j["id"]: j for j in data}
    
    # 检查每个监控任务
    results = {}
    for job_id in MONITORED_JOBS:
        results[job_id] = check_job_health(job_id, MONITORED_JOBS[job_id], jobs_lookup.get(job_id))
    
    # 生成并打印报告
    report = generate_report(results)
    print(report)
    
    # 根据状态退出
    if any(r["status"] == "critical" for r in results.values()):
        sys.exit(2)
    elif any(r["status"] == "warning" for r in results.values()):
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
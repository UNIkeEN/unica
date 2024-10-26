"""
Locale Comparison Script

This script compares locale JSON files in a directory, checking for missing or extra keys 
compared to a reference locale file. It helps ensure consistency across different language 
files by identifying any discrepancies in key-value pairs.

Usage:
    python compare.py <locale_key>

Parameters:
    locale_key : str
        The locale key representing the base language (e.g., "en" or "zh-Hans"). This key 
        determines the reference locale file against which all other locale files will be compared. 
        The reference file should be named "<locale_key>.json" and located in the same directory 
        as this script.

Functionality:
- Loads and flattens the key structure of JSON files for easy comparison.
- Compares the base locale file with each target locale file.
- Highlights missing and extra keys in target files relative to the base file.
- Provides color-coded output to indicate missing (red) and extra (green) keys.

Example Execution:
    python compare.py en

This command will:
- Compare "en.json" (base locale file) to all other JSON files in the directory.
- Output missing and extra keys for each target file, if any, using color coding.

--------------------------------------------------------------------------------

语言文件对比脚本

此脚本用于对比目录中的多语言 JSON 文件，检查相对于参考语言文件的缺少或多余的键，以确保不同语言文件之间的键值对一致性。

使用方法：
    python compare.py <locale_key>

参数：
    locale_key : str
        代表基础语言的键（例如 "en" 或 "zh-Hans"）。该键指定参考语言文件，
        脚本将根据此文件与其他语言文件进行对比。参考文件应命名为 "<locale_key>.json"，并位于与此脚本相同的目录下。

功能：
- 加载并扁平化 JSON 文件的键结构，便于对比。
- 将基础语言文件与每个目标语言文件进行对比。
- 输出每个目标文件中相对于基础文件的缺少和多余键。
- 使用颜色编码，缺少的键用红色标记，多余的键用绿色标记。

示例执行：
    python compare.py en

此命令将：
- 使用 "en.json" 作为基础语言文件，与目录中的其他 JSON 文件进行对比。
- 输出每个目标文件中缺少和多余的键（若存在），并进行颜色编码。
"""

import json
import os
import sys
from termcolor import colored

def flatten_dict(d, parent_key=''):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key))
        else:
            items.append(new_key)
    return items

def load_locale_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def compare_keys(base_keys, target_keys):
    base_set = set(base_keys)
    target_set = set(target_keys)
    missing = base_set - target_set
    extra = target_set - base_set
    return sorted(missing), sorted(extra)

def main(locale_key):
    locales_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))

    base_locale_path = os.path.join(locales_path, f"{locale_key}.json")

    if not os.path.exists(base_locale_path):
        print(f"Locale file '{locale_key}.json' not found in locales folder.")
        return
    
    base_locale = load_locale_file(base_locale_path)
    base_keys = sorted(flatten_dict(base_locale))

    for file_name in os.listdir(locales_path):
        if file_name.endswith('.json') and file_name != f"{locale_key}.json":
            target_locale_path = os.path.join(locales_path, file_name)
            target_locale = load_locale_file(target_locale_path)
            target_keys = sorted(flatten_dict(target_locale))

            missing, extra = compare_keys(base_keys, target_keys)

            if not missing and not extra:
                print(colored(f"'{file_name}' is identical to '{locale_key}.json'.", 'green'))
            else:
                print(f"Comparing {file_name}：")
                print(f"{len(missing)} missing, {len(extra)} extra keys")
                
                for key in missing:
                    print(colored(f"  Missing:   {key}", 'red'))
                for key in extra:
                    print(colored(f"  Extra:     {key}", 'green'))
            print("-" * 40)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python compare.py <locale_key>")
    else:
        main(sys.argv[1])

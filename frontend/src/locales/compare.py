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
                # Summary format with m and n counts
                print(f"Comparing {file_name}：")
                print(f"{len(missing)} missing, {len(extra)} extra keys")
                
                for key in missing:
                    print(colored(f"  Missing:   {key}", 'red'))
                for key in extra:
                    print(colored(f"  Extra:     {key}", 'green'))
            print("-" * 40)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python compare_locales.py <locale_key>")
    else:
        main(sys.argv[1])

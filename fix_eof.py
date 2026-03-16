with open("src/darkfeminine.tsx", "r") as f:
    lines = f.readlines()

# Find the last "export default"
idx = len(lines) - 1
while idx >= 0:
    if "export default" in lines[idx]:
        break
    idx -= 1

# We will just rewrite the last 10 lines
# Looking up from the export default, we want:
#         </div>
#       )}
#     </div>
#   );
# };
#
# export default DarkFeminineTSX;

# Replace everything from idx - 6 up to the end
idx_start = idx - 8
while idx_start < idx:
    if "        </div>" in lines[idx_start] and "    )" in lines[idx_start+1] and "}" in lines[idx_start+2]:
        break
    idx_start += 1
    if idx_start == idx:
        break

if idx_start < idx:
    new_end = [
        "        </div>\n",
        "      )}\n",
        "    </div>\n",
        "  );\n",
        "};\n",
        "\n",
        "export default DarkFeminineTSX;\n"
    ]
    lines = lines[:idx_start] + new_end
    with open("src/darkfeminine.tsx", "w") as f:
        f.writelines(lines)
    print("Fixed.")
else:
    print("Pattern not found.")

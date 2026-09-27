import os
import sys
import shutil
from pathlib import Path
import glob

# ---- Check for argument ----
if len(sys.argv) != 2:
    print("Usage: python3 asrun_generator_test-name.py <test_id>")
    sys.exit(1)

test_id = sys.argv[1]

# ---- Constants ----
as_run_folder = "campaign_1"
test_procedure_name = "test_procedure"

#Optional Capability
#if there is a string that should be replaced for each use of the procedure, 
#use this variable to replace it in the as run
#var_REPLACEPROCEDURETEXT = ""

# ---- Paths ----
home = str(Path.home())
procedure_dir = Path(__file__).resolve().parent.parent
as_run_dir = Path(os.path.join(procedure_dir, "as_runs", as_run_folder, test_id))
template_dir = Path(os.path.join(procedure_dir, "procedure_templates"))
procedure_pics_dir = Path(os.path.join(template_dir, "procedure_pictures"))


# ---- Create directory if it doesn't exist ----
os.makedirs(as_run_dir, exist_ok=True)

# ---- Copy Test Procedure ----
test_proc_pattern = os.path.join(as_run_dir, f"*{test_procedure_name}*")
test_proc_files = glob.glob(test_proc_pattern)

file_names = [f.name for f in template_dir.iterdir() if f.is_file()]

# Find the first file whose name contains the search text
procedure_dir = next(
    (f for f in template_dir.iterdir()
     if f.is_file() and test_procedure_name.lower() in f.name.lower()),
    None
)

if len(test_proc_files) == 0:
    dst = os.path.join(as_run_dir, f"{test_procedure_name}_{test_id}.hermes.md")
else:
    dst = os.path.join(as_run_dir, f"{test_procedure_name}_{test_id}_{len(test_proc_files) + 1}.hermes.md")

src = os.path.join(template_dir, f"{test_procedure_name}.hermes.md")
print(src, dst)
shutil.copy(src, dst)

# ---- Copy Procedure Pictures if Not Already Present ----
pictures_path = os.path.join(home, "seqs/test_procedure_templates", "procedure_pictures", as_run_folder, test_id)
if not os.path.exists(procedure_pics_dir) or len(os.listdir(procedure_pics_dir)) == 0:
    shutil.copytree(procedure_pics_dir, as_run_dir, dirs_exist_ok=True)

for file_path in glob.glob(os.path.join(as_run_dir, "*.hermes.md")):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content.replace("REPLACEPROCEDURETEXT", var_REPLACEPROCEDURETEXT)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated REPLACEWITHTESTID in file: {os.path.basename(file_path)}")
    else:
        print(f"No placeholders of REPLACEWITHTESTID found in: {os.path.basename(file_path)}")

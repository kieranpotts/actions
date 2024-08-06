import os
import json
import jsonschema
import argparse
import glob

parser = argparse.ArgumentParser()
parser.add_argument('--file', help='JSON file to validate')
parser.add_argument('--schema', help='JSON Schema file')
args = parser.parse_args()

exit_code = 0


def output(output):
    print(output, end="")
    summary.write(output)


with open(args.schema, 'r') as schema_file:
    schema = json.load(schema_file)

validator = jsonschema.Draft7Validator(schema)

with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as summary:
    for path in args.file.split():
        output(f"\nPATH: {path}")

        files = glob.glob(path, recursive=True)

        if not files:
            output(" has NO FILES")
            continue

        output(" has FILES")

        for file in files:
            output(f"\nFILE: {file}")

            with open(file, 'r') as json_file:
                json_data = json.load(json_file)

            errors = validator.iter_errors(json_data)


            has_errors = False
            for error in errors:
                if not has_errors:
                    output(" has ERRORS")
                    has_errors = True
                    exit_code = 1

                output(f"\nERROR: {error}")

            if not has_errors:
                output(" is VALID")


exit(exit_code)

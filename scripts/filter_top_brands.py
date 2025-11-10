#!/usr/bin/env python3
"""
Filter the vestiaire cleaned dataset for top brands (Hermes, Gucci, Coach).

Usage:
	python3 scripts/filter_top_brands.py \
		--input data/vestiaire_cleaneddataset.csv \
		--output data/vestiaire_top_brands.csv

The script streams the input CSV (handles large files), detects the brand column
by looking for a header containing the word 'brand' (case-insensitive), and
writes only rows whose brand matches one of the target brands.
"""

import csv
import argparse
import sys
from pathlib import Path


TARGET_BRANDS = {"hermes", "gucci", "coach"}


def find_brand_column(fieldnames):
	# Prefer an exact 'brand' match, otherwise look for any column containing 'brand'
	lowered = [f.lower() for f in fieldnames]
	if 'brand' in lowered:
		return fieldnames[lowered.index('brand')]
	for i, name in enumerate(lowered):
		if 'brand' in name:
			return fieldnames[i]
	# fallback attempts
	for i, name in enumerate(lowered):
		if 'designer' in name or 'label' in name:
			return fieldnames[i]
	return None


def filter_file(input_path, output_path, target_brands):
	input_path = Path(input_path)
	output_path = Path(output_path)

	if not input_path.exists():
		print(f"Input file not found: {input_path}", file=sys.stderr)
		return 2

	with input_path.open('r', encoding='utf-8', errors='replace', newline='') as fin:
		reader = csv.DictReader(fin)
		if reader.fieldnames is None:
			print("No header found in input CSV.", file=sys.stderr)
			return 3

		brand_col = find_brand_column(reader.fieldnames)
		if brand_col is None:
			print("Could not detect a brand column in the CSV headers:", reader.fieldnames, file=sys.stderr)
			return 4

		# Ensure output directory exists
		output_path.parent.mkdir(parents=True, exist_ok=True)

		with output_path.open('w', encoding='utf-8', newline='') as fout:
			writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
			writer.writeheader()
			written = 0
			total = 0
			for row in reader:
				total += 1
				brand_value = (row.get(brand_col) or '').strip().lower()
				if brand_value in target_brands:
					writer.writerow(row)
					written += 1

	print(f"Filtered {written} rows out of {total} written to {output_path}")
	return 0


def main():
	parser = argparse.ArgumentParser(description="Filter vestiaire CSV for top brands")
	parser.add_argument('--input', '-i', default='data/vestiaire_cleaneddataset.csv')
	parser.add_argument('--output', '-o', default='data/vestiaire_top_brands.csv')
	parser.add_argument('--brands', '-b', nargs='*', help='Override target brands (space separated)')
	args = parser.parse_args()

	brands = TARGET_BRANDS
	if args.brands:
		brands = {b.strip().lower() for b in args.brands}

	rc = filter_file(args.input, args.output, brands)
	sys.exit(rc)


if __name__ == '__main__':
	main()


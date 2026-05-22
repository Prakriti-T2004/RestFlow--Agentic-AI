#!/usr/bin/env python3
import sys
from pathlib import Path
import unicodedata

try:
    from PyPDF2 import PdfReader
except Exception as e:
    print('Missing PyPDF2. Install via: pip install PyPDF2', file=sys.stderr)
    sys.exit(2)

def extract_text(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    texts = []
    for page in reader.pages:
        try:
            texts.append(page.extract_text() or '')
        except Exception:
            continue
    return unicodedata.normalize('NFKC', "\n".join(texts))

def main():
    if len(sys.argv) < 2:
        print('Usage: extract_text.py <path-to-pdf>', file=sys.stderr)
        sys.exit(1)

    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    p = Path(sys.argv[1])
    if not p.exists():
        print('File not found: ' + str(p), file=sys.stderr)
        sys.exit(1)
    text = extract_text(str(p))
    # Output extracted text to stdout
    sys.stdout.write(text)
    if not text.endswith('\n'):
        sys.stdout.write('\n')

if __name__ == '__main__':
    main()

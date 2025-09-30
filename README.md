# Doc Detective
A lightweight tool to compare two PDFs side-by-side.
Built to feel like reviewing a pull request, but for contracts, policies, and documents that actually matter.

___

## Purpose

Sometimes you have two slightly different PDFs same title, same format, but sneaky differences that take a while to notice.
This tool uses Cardinal’s Markdown API to normalize both files, then highlights changes line by line.

## How it works

1. Upload two PDFs (A and B)
2. Backend calls Cardinal’s /markdown endpoint
3. Text is extracted
4. Frontend renders side-by-side diffs

## Stack

- Backend: FastAPI, Python, [Cardinal API](https://docs.trycardinal.ai/)
- Frontend: Vite + React + Typescript

___

### Features and Limitation
- You can view the extracted text and PDF of each document uploaded
- Side by side comparison
- Can only support one page for each document due to API limitations
- Only accepts PDF

### Try it out

Upload your own documents or load the given sample to preview.

Try it here: https://doc-diff-three.vercel.app/


### Future Enhancements

Currently, text extraction for the diff preview can produce inconsistent formatting between documents, which sometimes causes false-positive differences. Ensuring a standardized and deterministic extraction pipeline for both inputs is planned as a key improvement for future iterations.

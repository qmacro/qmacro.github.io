#!/usr/bin/env -S jq --raw-output --from-file

def unwanted_boards:
  [
    "Devtoberfestblog-board",
    "codejam-events",
    "community-events",
    "devtoberfest-events"
  ]
;

def is_valid_post:
  (.board.id as $b | unwanted_boards | index($b))
  or
  (.subject | startswith("Re: "))
  or
  (.subject | startswith("SAP Developer News,"))
  | not
;

def generate_filename:
  [.post_time[:10], (.view_href | split("/")[5])] | join("-")
;

def create_block:
  [
    generate_filename,
    .subject,
    .board.id,
    .post_time[:10],
    .view_href,
    .body
  ]
  | join("\n")
;

def main:
  map(
    select(is_valid_post)
    | create_block
  )
  | join("\n~~~\n")
;

main

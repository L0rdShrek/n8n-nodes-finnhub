import json
import re
from pathlib import Path

DOC_PATH = Path('docs/finnhub.io/docs/api/introduction.html')
OUTPUT_PATH = Path('nodes/Finnhub/route-definitions.json')

ARG_SECTION_END_PREFIXES = (
    'Response',
    'Sample',
    'Event Attributes',
    'Event Fields',
    'Data Fields',
    'Notes',
    'Data',
    'Value',
    'Values',
    'Outputs',
    'Premium:',
)
ARG_NEW_LINE_SUFFIXES = ('REQUIRED', 'optional', 'Optional')


def parse_route_definitions(text: str):
    lines = text.splitlines()
    sections = []
    n = len(lines)
    i = 0
    while i < n:
        line = lines[i]
        if line.startswith('Method: '):
            method = line.split(':', 1)[1].strip()
            examples: list[str] = []
            arguments = []
            premium = False
            j = i + 1
            while j < n:
                current = lines[j].strip()
                if current.startswith('Method:') and j != i:
                    break
                if current.startswith('Premium:') and 'Premium Access Required' in current:
                    premium = True
                    j += 1
                    continue
                if current.startswith('Examples:'):
                    j += 1
                    while j < n and not lines[j].strip():
                        j += 1
                    while j < n and lines[j].strip():
                        example_line = lines[j].strip()
                        if example_line.startswith('/'):
                            examples.append(example_line)
                        j += 1
                    continue
                if current.startswith('Arguments:'):
                    j += 1
                    while j < n:
                        candidate = lines[j].strip()
                        if not candidate:
                            j += 1
                            continue
                        if candidate.startswith(ARG_SECTION_END_PREFIXES):
                            break
                        raw = candidate
                        desc_lines_local = []
                        j += 1
                        break_to_next_argument = False
                        while j < n:
                            desc_candidate = lines[j].strip()
                            if not desc_candidate:
                                j += 1
                                break
                            if (
                                desc_candidate.startswith(ARG_SECTION_END_PREFIXES)
                                or desc_candidate.endswith(ARG_NEW_LINE_SUFFIXES)
                                or desc_candidate.startswith('Method:')
                                or desc_candidate.startswith('Examples:')
                            ):
                                break_to_next_argument = True
                                break
                            desc_lines_local.append(desc_candidate)
                            j += 1
                        arguments.append({'raw': raw, 'description': ' '.join(desc_lines_local)})
                        if not break_to_next_argument:
                            continue
                    continue
                j += 1
            sections.append({
                'method': method,
                'examples': examples,
                'arguments': arguments,
                'premium': premium,
            })
            i = j
        else:
            i += 1
    routes = []
    for section in sections:
        if section['method'] not in {'GET', 'POST', 'PUT', 'DELETE'}:
            continue
        if not section['examples']:
            continue
        route_path = section['examples'][0].split('?')[0]
        args = []
        for arg in section['arguments']:
            raw = arg['raw']
            match = re.match(r'^([A-Za-z0-9_\-]+?)(REQUIRED|optional|Optional)?$', raw)
            if not match:
                continue
            name = match.group(1)
            suffix = match.group(2) or ''
            args.append(
                {
                    'name': name,
                    'required': suffix == 'REQUIRED',
                    'description': arg['description'],
                }
            )
        routes.append(
            {
                'method': section['method'],
                'route': route_path,
                'premium': section['premium'],
                'arguments': args,
            }
        )
    return routes


def main():
    text = DOC_PATH.read_text()
    routes = parse_route_definitions(text)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(routes, indent=2))
    print(f'Extracted {len(routes)} route definitions to {OUTPUT_PATH}')


if __name__ == '__main__':
    main()

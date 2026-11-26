import sys, os, struct

def read_vint(buf, pos):
    b = buf[pos]
    if b == 0:
        return None, pos
    length = 1
    mask = 0x80
    while not (b & mask):
        mask >>= 1
        length += 1
    value = b & (mask - 1)
    for i in range(1, length):
        value = (value << 8) | buf[pos + i]
    return value, pos + length

def read_id(buf, pos):
    b = buf[pos]
    length = 1
    mask = 0x80
    while not (b & mask):
        mask >>= 1
        length += 1
    return int.from_bytes(buf[pos:pos+length], 'big'), pos + length

MASTER = {0x18538067, 0x1654AE6B, 0xAE, 0xE0, 0xE1, 0x1F43B675, 0x1F43B675}

def walk(buf, start, end, out, depth=0):
    pos = start
    while pos < end - 1:
        try:
            eid, p2 = read_id(buf, pos)
            size, p3 = read_vint(buf, p2)
        except Exception:
            return
        if size is None:
            return
        if eid == 0xB0 and size == 2:
            out['w'] = int.from_bytes(buf[p3:p3+2], 'big')
        elif eid == 0xBA and size == 2:
            out['h'] = int.from_bytes(buf[p3:p3+2], 'big')
        if eid in (0x18538067, 0x1654AE6B, 0xAE, 0xE0):
            walk(buf, p3, min(p3 + size, end), out, depth + 1)
        pos = p3 + size

for path in sys.argv[1:]:
    with open(path, 'rb') as f:
        buf = f.read()
    out = {}
    walk(buf, 0, len(buf), out)
    print(f"{os.path.basename(path)}\t{out.get('w','?')}x{out.get('h','?')}")

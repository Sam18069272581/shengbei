"""合成本站音效（纯代码生成，无版权问题）：木筊落地、签筒摇动、磬声、风铃。
用法：python3 scripts/make-sounds.py  → 生成 src/static/sound/*.wav，再由 ffmpeg 转 mp3。"""
import math, random, struct, wave, os, subprocess

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'static', 'sound')
random.seed(7)


def bandpass(sig, f, q):
    # RBJ 带通滤波器
    w = 2 * math.pi * f / SR
    a = math.sin(w) / (2 * q)
    b0, b1, b2 = a, 0, -a
    a0, a1, a2 = 1 + a, -2 * math.cos(w), 1 - a
    out, x1, x2, y1, y2 = [], 0, 0, 0, 0
    for x in sig:
        y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
        out.append(y)
        x2, x1, y2, y1 = x1, x, y1, y
    return out


def hit(dur, decay, freqs, amp=1.0):
    n = int(SR * dur)
    noise = [random.uniform(-1, 1) * math.exp(-i / (SR * decay)) for i in range(n)]
    mix = [0.0] * n
    for f, q, g in freqs:
        for i, v in enumerate(bandpass(noise, f, q)):
            mix[i] += v * g
    return [v * amp for v in mix]


def place(buf, snd, at):
    s = int(at * SR)
    for i, v in enumerate(snd):
        if s + i < len(buf):
            buf[s + i] += v


def bell(f0, dur, partials):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        v = sum(g * math.exp(-t / d) * math.sin(2 * math.pi * f0 * r * t) for r, g, d in partials)
        v *= min(1, t / 0.004)  # 起音
        out.append(v)
    return out


def save(name, buf):
    peak = max(abs(v) for v in buf) or 1
    path = os.path.join(OUT, name + '.wav')
    with wave.open(path, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(v / peak * 0.9 * 32767)) for v in buf))
    mp3 = path[:-4] + '.mp3'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', path, '-b:a', '64k', mp3], check=True)
    os.remove(path)


wood = [(700, 6, 1.0), (1650, 8, 0.6), (3100, 10, 0.25)]

# 木筊落地：两片先后着地，再各弹一下
clack = [0.0] * int(SR * 0.6)
for at, amp in [(0.0, 1.0), (0.05, 0.85), (0.16, 0.35), (0.22, 0.25), (0.3, 0.1)]:
    place(clack, hit(0.12, 0.012, wood, amp), at)
save('clack', clack)

# 签筒摇动：竹签互相碰撞的密集细响
rattle = [0.0] * int(SR * 1.0)
t = 0.0
while t < 0.92:
    f = random.uniform(1800, 3200)
    place(rattle, hit(0.04, 0.004, [(f, 9, 1.0), (f * 1.9, 10, 0.4)], random.uniform(0.3, 1.0)), t)
    t += random.uniform(0.012, 0.045)
save('rattle', rattle)

# 签支落地：一声清脆竹响
stick = [0.0] * int(SR * 0.4)
place(stick, hit(0.15, 0.01, [(2400, 10, 1.0), (4100, 12, 0.5)], 1.0), 0)
place(stick, hit(0.1, 0.008, [(2400, 10, 1.0)], 0.3), 0.09)
save('stick', stick)

# 磬：非谐波泛音，余音较长
save('bell', bell(392, 3.2, [(1, 1.0, 1.4), (2.76, 0.55, 0.8), (5.4, 0.3, 0.45), (8.93, 0.15, 0.25)]))

# 风铃：轻快的高音，用于吉兆、点香
chime = [0.0] * int(SR * 1.8)
for at, f in [(0.0, 1320), (0.12, 1760), (0.26, 1980)]:
    place(chime, bell(f, 1.5, [(1, 1.0, 0.5), (2.4, 0.3, 0.2)]), at)
save('chime', chime)
print('ok')

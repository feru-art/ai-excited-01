# Manta Out of a Puddle

[![ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/feru-art/ai-excited-01/rank.svg)](https://make.fun/bounty/ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/feru-art/ai-excited-01/reward.svg)](https://make.fun/bounty/ai-excited-01)

A giant manta ray bursting out of a tiny puddle — impossible scale, frozen
mid-leap. Made for make.fun's ["Make the AI judge excited"](https://make.fun/bounty/ai-excited-01)
competition (ai-excited-01, $250 in USDC to the top 20).

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `image.png` byte for byte to `entry.png` in the output
directory. No drawing, no re-encoding, so both runs write identical bytes.

## License

MIT — see [LICENSE](LICENSE).

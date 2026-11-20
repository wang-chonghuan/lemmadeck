import fs from 'node:fs'
import path from 'node:path'
import { T, editions, id, load } from './receipt.mjs'
for (const name of editions) {
  const p = path.join(T, name, 'lessons', id, 'lesson.template.json')
  const lesson = load(p)
  const replacements = name.endsWith('-en') ? [
    [
      'More precisely, at the frequency being studied, both inductive and capacitive reactance must be negligible for the circuit to be modeled as a **pure resistance**.',
      'In this model, we neglect the effects of inductance and capacitance.\nThe approximation must hold at the frequency being studied: the reactive part of the circuit is negligible compared with its resistance.'
    ],
    [
      'The word "pure" describes a model in which only resistance matters;\nenergy dissipation does not itself make reactance disappear.',
      'The word "pure" describes a model in which only resistance matters.\nEnergy dissipation does not itself make reactance disappear.'
    ]
  ] : [
    [
      '更准确地说，在所研究的交流频率下，电感和电容产生的电抗都必须小到可以忽略，才能把电路近似看成只有**纯电阻**。',
      '本课的**纯电阻**模型忽略电感和电容的影响。\n这个近似必须在所研究的交流频率下成立，也就是电路的电抗相对电阻可以忽略。'
    ],
    [
      '电阻把电源提供的电能转化为内能；',
      '电阻把电源提供的电能转化为内能。'
    ]
  ]
  for (const [before, after] of replacements) {
    if (!lesson.prose[1].text.includes(before)) throw new Error(`Missing exact target: ${before}`)
    lesson.prose[1].text = lesson.prose[1].text.replace(before, after)
  }
  if (name.endsWith('-en')) {
    const target = 'Lowercase letters represent instantaneous values: values at a particular moment.'
    lesson.prose[4].text = lesson.prose[4].text.replace(target,
      'Here, t is time and ω is angular frequency.\n' + target)
  } else {
    lesson.prose[4].text = lesson.prose[4].text.replace(
      '这里，小写字母表示某一时刻的瞬时值；\n\n大写字母带原书的振幅下标表示最大大小。',
      '这里，t 表示时间，ω 表示角频率。\n小写字母表示某一时刻的瞬时值，大写字母带原书的振幅下标表示最大大小。')
  }
  fs.writeFileSync(p, JSON.stringify(lesson, null, 2) + '\n')
}

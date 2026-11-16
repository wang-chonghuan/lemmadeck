import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(directory, '../../../..')
const seedPath = path.join(directory, '9p-t8-choice-seed.json')
const solutionsPath = path.join(directory, '9p-t8-choice-independent-solutions.json')
const draftPath = path.join(directory, '9p-t8-choice-draft.json')
const viewPath = path.join(directory, '9p-t8-choice-source-view.json')
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'))
const sourceSolutions = new Map(solutions.solutions.map((item) => [item.source_number, item.solution]))
const seedDigest = '03a7ce2180f2c3249f684473bcf95aae6ad6b4fea307e8e84e690b027af4255d'
const writtenLoss = '选择作答可检查完整结论及论证判断，但不能证明学习者能独立书写推导、计算过程或开放解释。'

if (seed.exercises.length !== 11 || seed.concepts.length !== 0
  || solutions.seed_sha256 !== seedDigest || solutions.options_constructed_at_this_stage !== false) {
  throw new Error('Unexpected source selection or missing prior independent solutions')
}
for (const target of [draftPath, viewPath]) {
  if (fs.existsSync(target)) throw new Error(`Refusing to overwrite ${target}`)
}

// The alternatives below are manually authored; this helper only serializes the native contract.
function question(number, mode, stem, task, unitReason, alternatives) {
  const figureIds = number === '4' ? ['fig-77'] : []
  return {
    id: `t8-q${number.padStart(2, '0')}`,
    source_numbers: [number],
    view: {
      mode,
      stem,
      figure_ids: figureIds,
      options: alternatives.map(([id, text]) => ({ id, text, figure_ids: [] })),
    },
    intent: {
      task,
      source_solution: sourceSolutions.get(number),
      unit_reason: unitReason,
      concept_blocks: [],
      limitations: [writtenLoss],
      figure_observations: figureIds.map((figure_id) => ({
        figure_id,
        observation: solutions.figure_observation.observation,
      })),
    },
    key: {
      correct: alternatives.filter((item) => item[2]).map((item) => item[0]),
      rationales: alternatives.map(([option_id, , truth, derivation, misconception]) => ({
        option_id,
        truth: truth ? 'correct' : 'incorrect',
        derivation,
        misconception,
      })),
    },
  }
}

const questions = [
  question(
    '1', 'multiple',
    '在相同温度、同一种物理性质和相同测量条件下，一个物体的性质随方向变化。已经排除仅由外部形状造成的差异。关于内部结构的下列推断，哪些成立？',
    '判断观察到各向异性是否足以证明晶体结构，并处理单晶、多晶取向和非晶材料的反例。',
    '把可成立的结构推断作为一个多选论证单元，不把原问压成孤立的是非判断；每项均需检验宏观性质与微观结构之间的推理。',
    [
      ['a', '晶粒具有择优取向的多晶可呈各向异性，因此不能仅据这种现象判定物体是单晶。', true,
        '各晶粒仍为晶体，但取向分布有偏向时宏观平均可保留方向差异；该现象不等于一块单晶。', null],
      ['b', '若同一种性质在各方向相同，就可判定物体不是晶体，而是非晶材料。', false,
        '随机取向的多晶可在宏观平均后近似各向同性，一些晶体的特定性质也可各向同性；反向判定不成立。',
        '将“晶体某些性质可各向异性”误当作“每种晶体的每种性质都必须各向异性”，再用其逆否命题判断材料。'],
      ['c', '受力的非晶材料也可能呈方向依赖，因此仍需另有证据才能确认周期晶格。', true,
        '应力或定向结构可以使非晶材料的某些性质随方向变化，观察本身不证明长程周期排列。', null],
      ['d', '只要排除了外形影响，各向异性就能独立确证物体内部存在周期晶格。', false,
        '排除外形仅排除了一个原因，未排除非晶材料的应力或定向结构造成的方向依赖。',
        '把排除一种非晶体原因误作排除所有非晶体原因，从宏观各向异性直接推出周期晶格。'],
    ],
  ),
  question(
    '2', 'single',
    '假设玻璃改为具有明确熔点的晶体材料，在熔点以下没有通常玻璃那样连续的软化区间。对于“这是否必然使吹玻璃这一职业消失”，哪项论证最合理？只作理论讨论，不进行高温操作。',
    '判断假设玻璃为晶体是否足以推出吹制工艺必然不存在，区分固态软化和液态加工。',
    '选择一个完整的条件论证，保留原题对职业消失这一普遍结论的评估，不以认出晶体定义替代推理。',
    [
      ['a', '明确熔点使材料在任何温度下都不能发生形状变化，因此吹制必然消失。', false,
        '明确熔点不排除熔化后的液态流动和变形，原条件仅排除了熔点以下的连续软化区间。',
        '把固态软化区间不存在误推为熔化后的液体也不可变形。'],
      ['b', '只要加热超过熔点成为液体，无论黏度和结晶速度如何，吹制都必然可行。', false,
        '成为液体并不足以保证适宜的加工黏度、工作时间和保形能力。',
        '把熔化这一必要加工可能性误当作足以保证吹制的全部条件。'],
      ['c', '原软化加工方式会受影响，但是否能采用液态吹制还取决于黏度、结晶速度和保形条件。', true,
        '题设改变了软化行为，却未给出决定液态吹制可行性的其他条件，不能推出职业必然消失或必然保留。', null],
      ['d', '只要最终固体属于晶体，熔化后也会保持原晶格，因此只能保持原来的形状。', false,
        '熔化后不再保持固体的长程周期晶格，固态晶体类别不能约束熔体始终保留原形。',
        '把固体的晶格秩序不加区分地延伸到熔化后的液态。'],
    ],
  ),
  question(
    '3', 'multiple',
    '讨论通常室温下的普通颗粒状食糖、琥珀和铝，不包括特殊制备的玻璃态糖。以下分类及其依据，哪些成立？晶体类别包括单晶和多晶。',
    '对全部三种源材料作晶体或非晶体判断，并检验分类依据。',
    '用材料分类与结构依据相连的多选断言覆盖三种对象；不是按列表逐个点击是非，也不只靠外形或标签认读。',
    [
      ['a', '普通颗粒状食糖属于晶体，颗粒内部的组成单元具有周期排列。', true,
        '通常颗粒状食糖是结晶糖，颗粒内部存在晶体结构；不要求整个样品是一块单晶。', null],
      ['b', '琥珀属于非晶体，其内部没有贯穿材料的长程周期晶格。', true,
        '通常琥珀为非晶固体，不能从局部排列或固态外观推断长程晶格。', null],
      ['c', '普通铝属于非晶体，因为其中不同晶粒的取向通常不完全一致。', false,
        '取向不同的晶粒各自仍可有周期晶格，组成的是多晶而非非晶。',
        '把多晶之间的取向不一致误当作每个晶粒内部也没有周期排列。'],
      ['d', '普通铝属于晶体，即使多晶样品的某种宏观性质可能近似各向同性。', true,
        '普通铝通常是多晶，晶粒内部有周期排列；随机取向造成的宏观近似各向同性不改变晶体分类。', null],
    ],
  ),
  question(
    '4', 'single',
    '食盐的摩尔质量为$M=0.058\\,\\mathrm{kg/mol}$，密度为$\\rho=2200\\,\\mathrm{kg/m^3}$。采用理想岩盐模型：全部离子中心组成等间距的三维简单立方位点，沿各立方轴方向交替放置钠离子和氯离子；每个化学式单位含一个钠离子和一个氯离子。取$N_A=6.02\\times10^{23}\\,\\mathrm{mol^{-1}}$。最近相邻的异种离子中心距离$d$应是哪项？下图仅示意外部立方外观，不含离子位置或距离刻度。',
    '由化学式单位计数、总离子位点密度和三维位点几何求最近异种离子距离。',
    '每项给出完整的距离表达式和同精度数值；要求完成计数与开立方，而不是从外观图中识别答案或只选一个中间因子。',
    [
      ['a', '$d=\\sqrt[3]{\\frac{M}{\\rho N_A}}\\approx3.52\\times10^{-10}\\,\\mathrm m$', false,
        '以化学式单位数rho NA/M作为全部离子位点数，得到d^3=M/(rho NA)，比正确d大2的立方根。',
        '把每个含两类离子的化学式单位只计成一个离子位点。'],
      ['b', '$d=\\sqrt[3]{\\frac{M}{2\\rho N_A}}\\approx2.80\\times10^{-10}\\,\\mathrm m$', true,
        '总位点密度2rho NA/M对应每个位点体积d^3，代入源M和rho及明示NA得2.797647x10^-10 m。', null],
      ['c', '$d=\\sqrt[3]{\\frac{M}{8\\rho N_A}}\\approx1.76\\times10^{-10}\\,\\mathrm m$', false,
        '把每个化学式单位含两个离子的计数因子，在三个坐标方向分别乘一次，误置总位点密度为2^3 rho NA/M，再开立方得到1.762407x10^-10 m。',
        '把只需计入一次的离子数因子误当作三个空间方向各自独立的倍数。'],
      ['d', '$d=\\sqrt{2}\\sqrt[3]{\\frac{M}{2\\rho N_A}}\\approx3.96\\times10^{-10}\\,\\mathrm m$', false,
        '先求出正确的异种间距，再乘sqrt(2)，得到同一离子子晶格中的最近同种邻距而非目标距离。',
        '把最近同种离子的面对角方向间距当作最近异种离子的轴向间距。'],
    ],
  ),
  question(
    '5', 'single',
    '一根圆形截面的棒直径为0.4厘米。沿轴线通过截面中心施加静态作用力，忽略自重和弯曲，截面上的轴向应力均匀。要使应力达到$15\\times10^7\\,\\mathrm{N/m^2}$，所需作用力约为多少？',
    '由直径求圆形截面积，再由应力求轴向力，保留全部源数值。',
    '一次选择完整的带单位力值；计算需同时处理直径与半径、厘米换算及面积的平方，不拆成答案槽。',
    [
      ['a', '$7.5\\times10^3\\,\\mathrm N$', false,
        '错误使用S=pi d^2而非pi(d/2)^2，力为4x1884.96=7539.82 N。',
        '把给定直径当作半径代入圆面积公式。'],
      ['b', '$1.9\\times10^3\\,\\mathrm N$', true,
        'd=.004 m，S=pi(.002)^2 m^2，F=1.5x10^8 S=1884.96 N。', null],
      ['c', '$1.9\\times10^5\\,\\mathrm N$', false,
        '先得S=pi(.2)^2=.12566 cm^2，再错误乘.01换为m^2，所得面积与力均比正确值大100倍。',
        '把平方厘米转为平方米时只应用一次长度换算因子。'],
      ['d', '$1.9\\times10^1\\,\\mathrm N$', false,
        '把0.4 cm误换为0.0004 m，面积减为正确值的百分之一，力为18.8496 N。',
        '错把厘米到米的换算因子写成千分之一，平方后使面积和力缩小100倍。'],
    ],
  ),
  question(
    '6', 'single',
    '一面竖直砖墙高20米，密度为$1800\\,\\mathrm{kg/m^3}$。墙体均匀、等截面，只承受自身重力，忽略砂浆、外加载荷与地基沉降。取$g=9.8\\,\\mathrm{m/s^2}$。仅按上方墙体的自重、采用相同安全系数比较各处最低所需抗压强度，哪项完整结论成立？这只是理想模型，不作为建筑设计依据。',
    '同时求墙底平均压应力并比较墙底、墙上部因上方自重而要求的最低抗压强度。',
    '把同一自重模型的数值结果与高度方向承载比较作为一个完整结论；不把原第二问遗漏，也不把最低要求误作必须使用不同实际砖材。',
    [
      ['a', '墙底应力约为$1.76\\times10^5\\,\\mathrm{Pa}$；较低处所需的最低抗压强度较高。', false,
        '把整墙沿高度的平均应力rho gH/2=176400 Pa误当墙底应力；承载方向判断本身正确。',
        '用沿高度平均的自重应力替代承受全部墙重的底部应力。'],
      ['b', '墙底应力约为$3.53\\times10^5\\,\\mathrm{Pa}$；墙底与墙上部所需的最低抗压强度相同。', false,
        '底部rho gH的计算正确，但各截面承担的上方重量随高度不同，最低强度要求不相同。',
        '由墙的截面积和密度相同误推各处支持的重量相同。'],
      ['c', '墙底应力约为$3.6\\times10^4\\,\\mathrm{Pa}$；较低处所需的最低抗压强度较高。', false,
        '直接用rho H=1800x20=36000当作应力，遗漏把单位面积质量转为重量所需的g。',
        '把每单位面积的墙体质量误当作单位面积的重力。'],
      ['d', '墙底应力约为$3.53\\times10^5\\,\\mathrm{Pa}$；较低处所需的最低抗压强度较高。', true,
        '墙底W/S=rho gH=1800x9.8x20=352800 Pa；下部支持更多上方墙重。同一种足够强的砖仍可用在各处，比较的是最低要求。', null],
    ],
  ),
  question(
    '7', 'single',
    '一根均匀钢丝上端固定，下端自由竖直悬挂，不挂重物。横截面积恒定，忽略缺陷和振动，仅考虑钢丝自重。抗拉强度极限为$3.2\\times10^8\\,\\mathrm{Pa}$，密度为$7800\\,\\mathrm{kg/m^3}$，取$g=9.8\\,\\mathrm{m/s^2}$。首次达到拉断条件的钢丝长度及控制这一极限的位置，哪项正确？不进行悬挂或拉断实验。',
    '用最大局部自重拉应力确定钢丝最短拉断长度。',
    '选择极限长度与控制截面的完整判断，要求理解张力沿高度分布而非机械代一个平均应力。',
    [
      ['a', '约8.4千米，由上端截面控制。', false,
        '用沿长度平均应力rho gL/2达到强度极限，得到正确极限长度的两倍约8.37 km。',
        '把平均拉应力作为首次局部断裂的判据。'],
      ['b', '约4.2千米，由下端截面控制。', false,
        '长度数值用rho gL求得正确，但自由下端无需支持下方钢丝，张力不在那里最大。',
        '把受到重力的方向误当作最大张力所在位置。'],
      ['c', '约4.2千米，由上端截面控制。', true,
        '上端承担全部钢丝重量，最大应力rho gL；L=3.2x10^8/(7800x9.8)=4186.29 m。', null],
      ['d', '约0.42千米，由上端截面控制。', false,
        '先算L=4186.29 m，再错用10000 m=1 km换算，得到.418629 km。',
        '把米到千米的换算除数错误增大十倍。'],
    ],
  ),
  question(
    '8', 'single',
    '均匀导线原长5米，横截面积为2.5平方毫米。沿轴线通过截面中心施加100牛顿的静态拉力后，伸长1毫米。假设处于线性弹性范围，忽略自重和温度变化。导线的应力$\\sigma$与杨氏模量$E$应是哪一组？',
    '同时计算原题要求的应力和杨氏模量，区分绝对伸长与应变。',
    '每项是同一变形数据的完整二量结果，不按两个数字答案槽拆题；须转换面积并计算相对伸长。',
    [
      ['a', '$\\sigma=4.0\\times10^7\\,\\mathrm{Pa}$，$E=2.0\\times10^{11}\\,\\mathrm{Pa}$。', true,
        'S=2.5x10^-6 m^2，sigma=100/S=4x10^7 Pa，epsilon=.001/5=2x10^-4，E=sigma/epsilon。', null],
      ['b', '$\\sigma=4.0\\times10^4\\,\\mathrm{Pa}$，$E=2.0\\times10^8\\,\\mathrm{Pa}$。', false,
        '错误把2.5 mm^2换成2.5x10^-3 m^2，sigma与E均缩小1000倍。',
        '平方毫米换平方米只用一次千分之一长度换算。'],
      ['c', '$\\sigma=4.0\\times10^7\\,\\mathrm{Pa}$，$E=2.0\\times10^8\\,\\mathrm{Pa}$。', false,
        'sigma算对，但把伸长1 mm作为1 m，epsilon=1/5=.2，使E=4x10^7/.2=2x10^8 Pa。',
        '相对伸长计算中未把毫米换成米。'],
      ['d', '$\\sigma=4.0\\times10^7\\,\\mathrm{Pa}$，$E=8.0\\times10^3\\,\\mathrm{Pa}$。', false,
        'sigma与epsilon算对，却计算E=sigma epsilon=4x10^7x2x10^-4=8000 Pa。',
        '由sigma=E epsilon移项时把除以epsilon错误改为乘以epsilon。'],
    ],
  ),
  question(
    '9', 'single',
    '子弹撞墙后停止，假设全部初始动能仅用于子弹自身升温和熔化，不传给墙壁或环境，也不计其他能量去向。材料熔点为$600\\,\\mathrm K$，比热容为$125\\,\\mathrm{J/(kg\\cdot K)}$，单位质量熔化热为$2.5\\times10^4\\,\\mathrm{J/kg}$，撞击前温度为$50^\\circ\\mathrm C$。比热容取常量，温标换算用$T/\\mathrm K=t/{}^\\circ\\mathrm C+273.15$。要恰好完全熔化，速度至少约为多少？只作理论计算，不进行射击或撞击实验。',
    '统一温标，计入升温与熔化能量，由动能求完全熔化所需速度。',
    '每项为完整速度结果，需要完成整个能量衡算；不只判断潜热项或抄读温度差。',
    [
      ['a', '$263\\,\\mathrm{m/s}$', false,
        '算对温差276.85 K，但只用v=sqrt(2x125x276.85)=263.083 m/s，遗漏单位质量熔化热。',
        '把刚升温到熔点误当成已经完全熔化。'],
      ['b', '$433\\,\\mathrm{m/s}$', false,
        '直接以600-50=550作为温差，v=sqrt(2[125x550+25000])=433.013 m/s。',
        '把不同温标的两个绝对温度直接相减。'],
      ['c', '$345\\,\\mathrm{m/s}$', true,
        '升温276.85 K，每千克需125x276.85+25000=59606.25 J；v=sqrt(2x59606.25)=345.272 m/s。', null],
      ['d', '$244\\,\\mathrm{m/s}$', false,
        '所需热量59606.25 J/kg算对，却由mv^2=Q求v=sqrt(59606.25)=244.144 m/s。',
        '动能表达式遗漏二分之一系数。'],
    ],
  ),
  question(
    '10', 'single',
    '要把0.2千克、初温$23^\\circ\\mathrm C$的水冷却到$8^\\circ\\mathrm C$，加入初温$-3^\\circ\\mathrm C$的小冰块。按通常大气压下的绝热热平衡模型，忽略容器吸放热、蒸发和溅出。本题明示采用近似物性：水的比热容为$4.2\\times10^3\\,\\mathrm{J/(kg\\cdot K)}$，冰的比热容为$2.1\\times10^3\\,\\mathrm{J/(kg\\cdot K)}$，冰的单位质量熔化热为$3.4\\times10^5\\,\\mathrm{J/kg}$，常压熔点为$0^\\circ\\mathrm C$。需要加入的冰质量约为多少？',
    '求冰质量，完整计入冰升温、熔化及所成水升温，保留全部源质量和温度。',
    '以满足完整热平衡的冰质量为响应单元；三个阶段不拆成机械子项，近似物性在题面给定，未声称查得原章物性表。',
    [
      ['a', '0.0337千克', false,
        '遗漏冰从-3到0 degC的升温，m=12600/(340000+8x4200)=.0337259 kg。',
        '把加入的冰当作初温已在熔点的冰。'],
      ['b', '0.0364千克', false,
        '遗漏熔化后的水从0到8 degC升温，m=12600/(3x2100+340000)=.0363846 kg。',
        '只加热并熔化冰，未让其成为与原水同温的最终水。'],
      ['c', '0.316千克', false,
        '遗漏熔化潜热，m=12600/(3x2100+8x4200)=.315789 kg。',
        '把冰转为水仅当作跨温区显热过程，不计相变吸热。'],
      ['d', '0.0332千克', true,
        '水放热.2x4200x15=12600 J；每千克冰吸收3x2100+340000+8x4200=379900 J，m=12600/379900=.0331666 kg。', null],
    ],
  ),
  question(
    '11', 'single',
    '绝热容器内有0.5千克、$0^\\circ\\mathrm C$的水和54.4克、$0^\\circ\\mathrm C$的冰，通入6.6克、$100^\\circ\\mathrm C$的水蒸气。按通常大气压下的热量衡算，蒸汽全部凝结并留在容器中，忽略容器吸放热、外界热交换和宏观机械能变化。本题明示采用近似物性：水的比热容为$4.2\\times10^3\\,\\mathrm{J/(kg\\cdot K)}$，冰的比热容为$2.1\\times10^3\\,\\mathrm{J/(kg\\cdot K)}$，冰的单位质量熔化热为$3.4\\times10^5\\,\\mathrm{J/kg}$，水的单位质量汽化热为$2.3\\times10^6\\,\\mathrm{J/kg}$，常压熔点为$0^\\circ\\mathrm C$。达到热平衡后的温度及相态，哪项正确？',
    '先比较蒸汽凝结冷却释放的能量与冰全部熔化所需能量，再求最终温度。',
    '将最终温度与是否残留冰作为一个完整物理状态，避免只认温度数字而遗漏相变条件；增加相态判断仅为检验原温度解的必要条件。',
    [
      ['a', '约$7.6^\\circ\\mathrm C$，全部为液态水。', false,
        '把蒸汽凝结冷却到0 degC释放的17952 J全部用于.561 kg水升温，T=17952/(.561x4200)=7.619 degC，未扣冰的熔化热。',
        '把原有冰从一开始就视为液态水，跳过熔化阶段。'],
      ['b', '$0^\\circ\\mathrm C$，冰和液态水共存。', true,
        '蒸汽凝结并冷却至0 degC给出.0066(2300000+4200x100)=17952 J，少于.0544x340000=18496 J，仍余.0016 kg冰，平衡温度0 degC。', null],
      ['c', '$0^\\circ\\mathrm C$，冰恰好全部熔化。', false,
        '在作相变不等式判断前，把17952 J和18496 J都过早舍入成1.8x10^4 J，误认为所有冰恰在0 degC熔尽。',
        '在相变临界比较前舍入热量，使不足以熔尽冰的能量被当作与熔化需求相等。'],
      ['d', '约$-0.23^\\circ\\mathrm C$，冰和液态水共存。', false,
        '先强制所有冰熔化，再令余热17952-18496=-544 J使.561 kg水降温，T=-544/(.561x4200)=-.23088 degC；这种代数分支违反常压冰水平衡条件。',
        '未经相态判定就使用全部液化后的温度方程，再把负结果解释成冰水共存温度。'],
    ],
  ),
]

const draft = {
  schema: 's10y-choice-draft-v1',
  seed_sha256: seedDigest,
  new_figures: [],
  questions,
  coverage: seed.exercises.map((source) => ({
    source_number: source.number,
    question_ids: questions.filter((item) => item.source_numbers.includes(source.number)).map((item) => item.id),
    omitted_tasks: [writtenLoss],
    reason: '原题的全部结论目标、对象与给定数据保留在完整响应单元中；开放解释和独立计算的书写能力仍由原书面任务承载，不将选择作答宣称为相同生产能力。',
  })),
}
const sourceView = {
  exercises: seed.exercises.map(({ number, text, figure_ids }) => ({ number, text, figure_ids })),
  concept_candidates: [],
  figures: seed.figures.map(({ id, label }) => ({ id, label })),
}
for (const [filename, document] of [[draftPath, draft], [viewPath, sourceView]]) {
  fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
}
function fileHash(filename) {
  return crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
}
console.log(JSON.stringify({
  status: 'author-draft-pending-structural-check-and-independent-semantic-review',
  questions: questions.length,
  options: questions.reduce((sum, item) => sum + item.view.options.length, 0),
  modes: questions.reduce((counts, item) => {
    counts[item.view.mode] = (counts[item.view.mode] ?? 0) + 1
    return counts
  }, {}),
  draft: { path: path.relative(root, draftPath), sha256: fileHash(draftPath) },
  sourceView: { path: path.relative(root, viewPath), sha256: fileHash(viewPath) },
  solutionsBeforeOptions: { path: path.relative(root, solutionsPath), sha256: fileHash(solutionsPath) },
}, null, 2))

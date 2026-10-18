// LEVEL 3: UK INVESTING & TAX WRAPPERS
export const level3Lessons = [
  {
    id: 17,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'Stocks & Shares ISA',
    time: '5 min',
    xp: 75,
    published: true,
    objectives: [
      'Master the UK Stocks & Shares Individual Savings Account (ISA) structure',
      'Understand the £20,000 annual ISA allowance and tax-free compounding benefits',
      'Learn how the "Use It or Lose It" April 5th tax deadline works'
    ],
    introduction: 'The UK Stocks & Shares ISA is widely considered one of the world\'s most generous personal tax shelters, offering completely tax-free growth and income for life.',
    explanation: 'Introduced by the UK government to encourage personal investing, an Individual Savings Account (ISA) allows UK tax residents aged 18 or over to invest up to £20,000 per tax year (which runs from 6th April to 5th April). Inside a Stocks & Shares ISA, all capital gains, dividends, and interest are 100% exempt from UK income tax and capital gains tax (CGT) forever. You do not even have to report your ISA holdings or sales on your HMRC Self-Assessment tax return. Furthermore, you can withdraw your funds at any time with zero tax penalties. The £20,000 annual limit does not roll over; if you do not utilize your allowance before midnight on April 5th, that year\'s tax shelter capacity is lost permanently.',
    terminology: [
      { term: 'Stocks & Shares ISA', definition: 'A tax-advantaged account that allows UK residents to invest in shares, ETFs, and bonds with zero tax on gains or dividends.' },
      { term: 'ISA Allowance', definition: 'The maximum amount you can deposit into ISAs in a single UK tax year (currently £20,000 across all your ISA accounts combined).' },
      { term: 'Flexible ISA', definition: 'An ISA feature allowing you to withdraw cash and replace it within the same tax year without reducing your remaining allowance.' }
    ],
    practicalExample: 'If you invest £20,000 inside an ISA into a global index ETF, and over 15 years it compounds to £65,000, your £45,000 profit is 100% tax-free. If that same investment were held outside an ISA, you could owe thousands in Capital Gains Tax and Dividend Tax to HMRC.',
    scenario: 'Charlotte deposits £15,000 in January and a further £5,000 on April 3rd into her Vanguard Stocks & Shares ISA. She has maximized her full £20,000 allowance for that tax year. On April 6th, the new tax year begins, and a fresh £20,000 allowance becomes immediately available to her.',
    commonMistakes: [
      'Assuming you must invest in individual UK stocks (you can hold global ETFs like VWRP or S&P 500 funds).',
      'Leaving money in a Cash ISA earning 3% when you have a 20-year horizon that needs equity compounding.',
      'Waiting until the final weekend before April 5th to fund your account when bank transfers can delay.'
    ],
    keyTakeaways: [
      '£20,000 annual allowance per adult UK tax resident (6 April to 5 April).',
      'Zero Capital Gains Tax, zero Dividend Tax, and zero reporting required on HMRC tax returns.',
      '"Use it or lose it": unused annual allowance expires permanently at the end of each tax year.'
    ],
    quiz: [
      {
        question: 'What is the current annual UK ISA allowance for the 2024/25 tax year across all your ISAs combined?',
        options: [
          '£20,000',
          '£10,000',
          '£50,000',
          'Unlimited'
        ],
        answer: 0,
        explanation: 'The UK government provides a generous £20,000 overall annual ISA allowance per individual each tax year.'
      },
      {
        question: 'What UK tax is due on capital gains and dividends earned inside a Stocks & Shares ISA?',
        options: [
          '0% (Completely exempt from UK Capital Gains Tax and Dividend Tax)',
          '20% standard rate on withdrawal',
          '40% higher rate for earners above £50,270',
          'A flat 5% stamp duty fee'
        ],
        answer: 0,
        explanation: 'All investment growth, capital gains, and dividend payouts generated inside a Stocks & Shares ISA are 100% tax-free forever.'
      },
      {
        question: 'If you only contribute £12,000 into your ISA by April 5th, what happens to the remaining £8,000 of your annual allowance?',
        options: [
          'It is permanently lost and does NOT roll over into the next tax year',
          'It automatically adds to next year’s allowance making it £28,000',
          'HMRC sends you a cheque for £8,000',
          'It converts into government debt bonds'
        ],
        answer: 0,
        explanation: 'The ISA allowance operates strictly on a "use it or lose it" basis; unutilized allowance vanishes when the new tax year starts on April 6th.'
      }
    ]
  },
  {
    id: 18,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'Junior ISA (JISA)',
    time: '4 min',
    xp: 65,
    published: true,
    objectives: [
      'Understand how the Junior ISA (JISA) gives UK children a head start in wealth',
      'Learn the £9,000 annual JISA limit and ownership rules at age 18',
      'Evaluate the compounding power of investing across an 18-year childhood horizon'
    ],
    introduction: 'A Junior ISA (JISA) is a tax-free savings and investment account dedicated to UK children under the age of 18, with capital legally locked until their 18th birthday.',
    explanation: 'Parents or legal guardians can open a Junior Stocks & Shares ISA for any UK resident child from birth. For the 2024/25 tax year, up to £9,000 can be contributed each year by parents, grandparents, relatives, or family friends. All investment growth and dividends compound completely tax-free. Crucially, the money is legally the child\'s property: once deposited, funds cannot be withdrawn by parents for general household use. On the child\'s 18th birthday, the account automatically converts into a full adult Stocks & Shares ISA, granting the young adult full access and control over their accumulated wealth.',
    terminology: [
      { term: 'Junior ISA (JISA)', definition: 'A tax-free investment account for children under 18 with an annual contribution limit of £9,000.' },
      { term: 'Child Trust Fund (CTF)', definition: 'The predecessor account to the Junior ISA, which can be transferred into a modern JISA for lower platform fees.' },
      { term: 'Beneficial Ownership', definition: 'The legal right to enjoy the financial benefits of an asset; in a JISA, the child is the sole beneficial owner.' }
    ],
    practicalExample: 'If parents invest £150 per month into a global index fund inside a Junior ISA from the month a child is born until age 18 (total cash invested: £32,400) at an average 8% return, the young adult receives a tax-free nest egg of approximately £72,000 on their 18th birthday—enough to fund university or a house deposit.',
    scenario: 'Grandparents want to gift £2,000 annually to their newborn granddaughter. By depositing the funds directly into her Junior Stocks & Shares ISA rather than an ordinary bank account, the capital compounds in productive global enterprises with zero tax liabilities for 18 continuous years.',
    commonMistakes: [
      'Keeping Junior ISA funds in a cash JISA for 18 years, allowing inflation to erode purchasing power.',
      'Failing to realize that the child gains full legal control of the entire balance at age 18.',
      'Leaving old Child Trust Funds (CTFs) with high legacy fees instead of transferring them to modern JISAs.'
    ],
    keyTakeaways: [
      '£9,000 annual contribution limit per child (separate from parents’ £20,000 ISA allowance).',
      'Capital is locked until the child reaches age 18.',
      'Converts into an adult ISA at 18, providing a life-changing tax-free financial foundation.'
    ],
    quiz: [
      {
        question: 'What is the annual UK Junior ISA (JISA) contribution limit for the 2024/25 tax year?',
        options: [
          '£9,000 per child',
          '£20,000 per child',
          '£1,000 per child',
          '£4,000 per child'
        ],
        answer: 0,
        explanation: 'The annual limit for a Junior ISA is currently £9,000 per eligible child per tax year.'
      },
      {
        question: 'At what age does a child gain full legal control over their Junior ISA funds?',
        options: [
          'At age 18',
          'At age 21',
          'At age 25',
          'Whenever the parents decide to sign a waiver'
        ],
        answer: 0,
        explanation: 'Under UK law, the Junior ISA automatically converts to an adult ISA on the child\'s 18th birthday, transferring full legal ownership to the young adult.'
      },
      {
        question: 'Can parents withdraw money from a Junior ISA to pay for family holidays or home improvements?',
        options: [
          'No, the capital legally belongs to the child and cannot be withdrawn until age 18',
          'Yes, parents can withdraw at any time with a 5% fee',
          'Yes, provided both parents sign a joint bank letter',
          'Only during school summer holidays'
        ],
        answer: 0,
        explanation: 'JISA funds are locked by law until the child turns 18; parents cannot access or withdraw the deposited capital.'
      }
    ]
  },
  {
    id: 19,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'Lifetime ISA (LISA)',
    time: '5 min',
    xp: 70,
    published: true,
    objectives: [
      'Understand the 25% government bonus on Lifetime ISA contributions',
      'Learn the dual purposes of the LISA: first-time home purchase or retirement at 60',
      'Understand the 25% early withdrawal penalty for unauthorized liquidations'
    ],
    introduction: 'The Lifetime ISA (LISA) is a UK government scheme designed to help adults buy their first home or save for retirement, featuring an immediate 25% government top-up.',
    explanation: 'Any UK resident aged 18 to 39 can open a Lifetime ISA and contribute up to £4,000 per tax year until age 50. The UK government adds a free 25% cash bonus to whatever you deposit (up to a maximum bonus of £1,000 per year). If you deposit £4,000, HMRC tops it up to £5,000. This £5,000 can then be invested into shares and ETFs completely tax-free. You can withdraw the money with zero penalty under two circumstances: 1) Purchasing your first residential home valued up to £450,000 with a mortgage, or 2) After your 60th birthday for retirement. Crucially, if you withdraw the money for any other reason, the government applies a 25% penalty on the total withdrawal amount, which claws back the government bonus plus an extra penalty on your own money.',
    terminology: [
      { term: 'Lifetime ISA (LISA)', definition: 'An ISA offering a 25% government bonus (up to £1,000/year) for buying a first home up to £450k or for retirement at 60.' },
      { term: 'Government Bonus', definition: 'The 25% cash boost added by HMRC within 4 to 9 weeks of contributing to a LISA.' },
      { term: '25% Withdrawal Penalty', definition: 'The charge levied on unauthorized withdrawals, which leaves you with approximately 6.25% less than you deposited.' }
    ],
    practicalExample: 'If you contribute £4,000 per year for 5 years (£20,000 out-of-pocket), the government deposits an extra £5,000 in bonuses. If invested in a growing index fund that achieves modest capital gains, your deposit towards your first home could reach £30,000+ with one-sixth of it paid directly by the state.',
    scenario: 'Alex deposits £1,000 into a LISA and receives a £250 government bonus, totaling £1,250. An unexpected expense arises, and Alex withdraws the full £1,250 for a holiday. The 25% penalty on £1,250 is £312.50. Alex walks away with £937.50—losing £62.50 of his own original £1,000 deposit! Never put emergency funds in a LISA.',
    commonMistakes: [
      'Using a LISA for short-term emergency funds and suffering the 25% withdrawal penalty.',
      'Buying a first home above the £450,000 statutory price cap (which triggers the penalty).',
      'Opening an account after turning 40 (you must make your initial deposit before your 40th birthday).'
    ],
    keyTakeaways: [
      '25% free government bonus on up to £4,000 saved per tax year (maximum £1,000 annual bonus).',
      'Permitted penalty-free uses: buying a first home up to £450,000 or reaching age 60.',
      'Unauthorized withdrawals trigger a 25% penalty, which reclaims more than the bonus.'
    ],
    quiz: [
      {
        question: 'What is the maximum annual cash bonus provided by the UK government in a Lifetime ISA (LISA)?',
        options: [
          '£1,000 per year (25% on £4,000 contributed)',
          '£4,000 per year',
          '£250 once in a lifetime',
          '£5,000 per year'
        ],
        answer: 0,
        explanation: 'Contributing the maximum £4,000 annual allowance generates a 25% government top-up of £1,000.'
      },
      {
        question: 'What is the maximum property purchase price allowed when using a LISA to purchase a first home?',
        options: [
          '£450,000 anywhere in the UK',
          '£250,000 outside London only',
          '£1,000,000',
          'There is no limit on purchase price'
        ],
        answer: 0,
        explanation: 'Under current UK legislation, the maximum residential property price for a LISA first-time home purchase is £450,000.'
      },
      {
        question: 'Why does an unauthorized early withdrawal from a LISA result in a loss of your own original capital?',
        options: [
          'Because the 25% penalty is applied to the total balance (original capital plus bonus), clawing back roughly 6.25% of your deposit',
          'Because banks charge a 50% liquidation fee',
          'Because all investments in a LISA are confiscated by the police',
          'Because the Bank of England freezes early withdrawal accounts'
        ],
        answer: 0,
        explanation: 'If £1,000 turns into £1,250 with bonus, a 25% penalty on £1,250 is £312.50, leaving you with £937.50 of your original £1,000.'
      }
    ]
  },
  {
    id: 20,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'Self-Invested Personal Pension (SIPP)',
    time: '5 min',
    xp: 75,
    published: true,
    objectives: [
      'Understand how Self-Invested Personal Pensions (SIPPs) provide tax relief on contributions',
      'Learn the difference between 20%, 40%, and 45% tax relief for different income bands',
      'Understand pension access age rules (currently age 55, rising to 57 in 2028)'
    ],
    introduction: 'A Self-Invested Personal Pension (SIPP) gives you complete freedom to control your own retirement investments while benefiting from extraordinary upfront government tax relief.',
    explanation: 'When you contribute money into a SIPP, the UK government rewards you with tax relief equivalent to your highest rate of income tax. If you are a basic-rate (20%) taxpayer, depositing £800 into your SIPP automatically triggers a £200 tax refund paid into the account by HMRC, boosting your balance to £1,000. If you are a higher-rate (40%) taxpayer, you can claim an additional £200 back through your Self-Assessment tax return, meaning a £1,000 pension investment costs you just £600 in net earnings! Inside the SIPP, all investments grow completely free of UK capital gains and dividend taxes. In exchange for this massive tax relief, the capital is locked until minimum pension age (currently 55, rising to 57 from April 2028). At retirement, you can withdraw 25% of your pension completely tax-free (up to £268,275), with the remaining 75% taxed as ordinary income as you draw it down.',
    terminology: [
      { term: 'SIPP', definition: 'Self-Invested Personal Pension; a personal pension scheme where you choose and manage the individual investments.' },
      { term: 'Pension Tax Relief', definition: 'Government top-ups on pension contributions reflecting the income tax you previously paid on that income.' },
      { term: 'Annual Pension Allowance', definition: 'The maximum you can contribute to pensions each tax year with tax relief (currently £60,000 or 100% of your UK relevant earnings).' }
    ],
    practicalExample: 'A higher-rate taxpayer earning £65,000 contributes £8,000 net into their SIPP. HMRC automatically adds £2,000 basic tax relief into the SIPP (total: £10,000). The investor then claims an additional £2,000 higher-rate relief via their Self Assessment return. The net cost of a £10,000 investment in their portfolio was only £6,000.',
    scenario: 'James, aged 32, receives a £5,000 work bonus. He knows he won\'t need this money until retirement. By putting it into a SIPP, government tax relief immediately turns it into £6,250 (plus another £1,250 tax reduction if he pays 40% tax). Compounded for 25 years at 8%, that £5,000 bonus grows to over £42,000 inside his pension.',
    commonMistakes: [
      'Leaving pension contributions in default high-fee, low-performing lifestyle funds that hold too much cash and bonds in your 20s and 30s.',
      'Forgetting to claim 40% or 45% higher-rate tax relief through HMRC Self-Assessment or PAYE code adjustments.',
      'Ignoring the rising minimum pension age (57 from 2028).'
    ],
    keyTakeaways: [
      'Upfront tax relief of 20% to 45% significantly boosts your initial capital.',
      'Investments compound tax-free until minimum retirement age (55, rising to 57 in 2028).',
      '25% of the accumulated pension pot can be taken completely tax-free at retirement.'
    ],
    quiz: [
      {
        question: 'For a basic-rate (20%) UK taxpayer, how much does HMRC automatically add to an £800 net SIPP contribution?',
        options: [
          '£200 (bringing the total invested balance to £1,000)',
          '£80',
          '£500',
          'Zero relief'
        ],
        answer: 0,
        explanation: 'Basic rate tax relief automatically grosses up an £800 contribution by £200 (20% of the £1,000 gross total).'
      },
      {
        question: 'What is the standard UK annual pension allowance for the 2024/25 tax year for most individuals?',
        options: [
          '£60,000 (or 100% of relevant UK earnings, whichever is lower)',
          '£20,000',
          '£4,000',
          '£100,000'
        ],
        answer: 0,
        explanation: 'The standard annual pension allowance is £60,000 per tax year (subject to tapering for very high earners above £200k+).'
      },
      {
        question: 'What percentage of your accumulated SIPP can typically be withdrawn as a tax-free lump sum once you reach minimum pension age?',
        options: [
          '25% tax-free (subject to the Lump Sum Allowance cap of £268,275)',
          '100% tax-free',
          'Zero percent (all withdrawals are taxed at 50%)',
          '50% tax-free'
        ],
        answer: 0,
        explanation: 'UK rules allow you to withdraw up to 25% of your pension fund completely tax-free, with the remaining 75% taxed as income.'
      }
    ]
  },
  {
    id: 21,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'General Investment Account (GIA)',
    time: '4 min',
    xp: 65,
    published: true,
    objectives: [
      'Understand the role of a General Investment Account (GIA) when ISA allowances are filled',
      'Learn how the "Bed and ISA" strategy transfers GIA investments into tax shelters',
      'Recognise the record-keeping requirements for HMRC tax compliance'
    ],
    introduction: 'A General Investment Account (GIA) is a standard taxable trading account with no deposit limits, used once your annual £20,000 ISA and pension limits have been utilized.',
    explanation: 'While ISAs and pensions offer total tax shelter, they have strict annual contribution caps. If you have substantial capital to invest (e.g. from a business sale, inheritance, or high earnings) exceeding £20,000 per year, a General Investment Account (also called a Taxable Brokerage Account) holds your overflow investments. In a GIA, there are zero limits on how much you can deposit or withdraw. However, you are exposed to UK Capital Gains Tax (CGT) on realized profits above the annual exemption and Dividend Tax on dividends received above the dividend allowance. Savvy investors use an annual technique called "Bed and ISA": each new tax year, they sell £20,000 worth of shares in their GIA and immediately repurchase them inside their Stocks & Shares ISA, progressively shifting wealth from taxable accounts into permanent tax shelters.',
    terminology: [
      { term: 'GIA', definition: 'General Investment Account; an unsheltered taxable investment account with no contribution limits.' },
      { term: 'Bed and ISA', definition: 'The process of selling investments held in a taxable GIA and immediately repurchasing them inside an ISA to shield future growth from tax.' },
      { term: 'Realized Gain', definition: 'A profit that results from officially selling an asset for a higher price than its original cost basis.' }
    ],
    practicalExample: 'You inherit £100,000. You immediately place £20,000 into your Stocks & Shares ISA. The remaining £80,000 is invested in broad index funds in a GIA. Every April, you execute a "Bed and ISA" transfer of £20,000 from the GIA into your ISA. Within 4 years, all £100,000 is safely sheltered inside your tax-free ISA.',
    scenario: 'An investor holds £50,000 in a GIA that produces £1,500 in annual dividends. Because the UK Dividend Allowance is currently £500, the investor must pay UK Dividend Tax on the £1,000 excess according to their income tax band (8.75% for basic rate, 33.75% for higher rate).',
    commonMistakes: [
      'Investing in a GIA before maximizing your £20,000 tax-free Stocks & Shares ISA allowance.',
      'Failing to keep accurate records of purchase prices (book cost) for capital gains calculations.',
      'Holding high-turnover active funds in a GIA that trigger unwanted taxable events every year.'
    ],
    keyTakeaways: [
      'GIAs have no deposit or withdrawal limits, making them ideal for overflow wealth.',
      'Profits and dividends above annual allowances are subject to UK tax.',
      'Use the "Bed and ISA" strategy each April to systematically move taxable investments into tax shelters.'
    ],
    quiz: [
      {
        question: 'When should a UK investor typically consider investing new funds through a General Investment Account (GIA)?',
        options: [
          'After they have already maximized their £20,000 annual ISA allowance and relevant pension limits',
          'Before opening an ISA because GIAs offer better tax benefits',
          'Only if they want to pay extra taxes to the government voluntarily',
          'Only after reaching age 65'
        ],
        answer: 0,
        explanation: 'A GIA is an overflow vehicle; you should always maximize tax-sheltered accounts (ISA and SIPP) before deploying funds in a taxable GIA.'
      },
      {
        question: 'What is the "Bed and ISA" strategy?',
        options: [
          'Selling investments in a taxable account (GIA) and repurchasing them inside your ISA to utilize your new annual allowance',
          'Investing only in hotel and hospitality stocks',
          'Borrowing against your home mortgage to fund your pension',
          'Holding all your ISA funds in overnight cash'
        ],
        answer: 0,
        explanation: 'Bed and ISA is the established UK practice of migrating capital from taxable accounts into tax-free ISAs year by year.'
      },
      {
        question: 'Unlike an ISA, what does holding investments in a GIA require you to track for HMRC tax reporting?',
        options: [
          'Realized capital gains and losses upon selling, and annual dividend distributions received',
          'The exact battery level of your computer when placing orders',
          'The political affiliation of every company\'s board of directors',
          'Zero records are ever required for taxable accounts'
        ],
        answer: 0,
        explanation: 'Investors must maintain records of purchase costs, sale proceeds, and dividend vouchers to calculate capital gains and dividend taxes.'
      }
    ]
  },
  {
    id: 22,
    level: 3,
    levelTitle: 'UK Investing',
    title: 'Investment Tax Basics',
    time: '5 min',
    xp: 75,
    published: true,
    objectives: [
      'Master the UK Capital Gains Tax (CGT) annual exempt amount and rates',
      'Understand the UK Dividend Allowance and dividend tax rates across income bands',
      'Learn how tax rules can change and the importance of professional advice'
    ],
    introduction: 'Understanding UK investment taxation ensures you structure your assets efficiently and avoid unexpected liabilities to HM Revenue & Customs.',
    explanation: 'In the UK, investments outside tax wrappers face two primary taxes: Capital Gains Tax (CGT) and Dividend Tax. For the 2024/25 tax year, the UK Capital Gains Tax annual exemption is £3,000 (meaning the first £3,000 of net realized profit from asset sales in a tax year is exempt). Realized profits above £3,000 are taxed at 10% for basic-rate taxpayers or 20% for higher and additional-rate taxpayers on shares (note: residential property carries different rates). For dividends outside an ISA, every individual receives a £500 annual Dividend Allowance. Above £500, dividends are taxed at 8.75% (basic rate), 33.75% (higher rate), or 39.35% (additional rate). Stamp Duty Reserve Tax (SDRT) of 0.5% also applies when buying individual UK company shares on the LSE (though ETFs and foreign stocks are typically exempt). Because tax legislation changes frequently, these figures reflect current thresholds and do not constitute personalized financial advice.',
    terminology: [
      { term: 'Capital Gains Tax (CGT)', definition: 'A tax on the profit when you sell or dispose of an asset that has increased in value.' },
      { term: 'Dividend Allowance', definition: 'The tax-free threshold of dividend income you can receive in a tax year outside an ISA (currently £500 for 2024/25).' },
      { term: 'Stamp Duty Reserve Tax (SDRT)', definition: 'A 0.5% transaction tax paid when purchasing UK electronic shares on the London Stock Exchange.' }
    ],
    practicalExample: 'In a GIA, you buy shares for £10,000 and sell them for £15,000, making a £5,000 profit. Under the 2024/25 £3,000 allowance, £3,000 is tax-free. If you are a higher-rate taxpayer, you pay 20% CGT on the remaining £2,000 profit (£400 in tax). Inside an ISA, you would pay £0.00.',
    scenario: 'Sophie earns £35,000/year (basic rate). Outside her ISA, she receives £1,200 in dividends from company shares. The first £500 is tax-free under the Dividend Allowance. On the remaining £700, she pays 8.75% tax (£61.25). By shifting those shares into her ISA, she permanently eliminates that tax.',
    commonMistakes: [
      'Assuming Capital Gains Tax is due before you sell (CGT only applies when gains are officially realized upon disposal).',
      'Failing to offset realized investment losses against capital gains to lower your taxable bill.',
      'Believing UK tax rules never change (the CGT allowance was reduced from £12,300 to £3,000 between 2022 and 2024).'
    ],
    keyTakeaways: [
      'Current UK CGT annual exemption is £3,000; excess equity gains are taxed at 10% or 20%.',
      'Dividend Allowance is £500; excess dividends are taxed at 8.75%, 33.75%, or 39.35%.',
      'Maxing out your Stocks & Shares ISA shields your entire portfolio from both taxes.'
    ],
    quiz: [
      {
        question: 'What is the UK Capital Gains Tax (CGT) annual exemption amount for an individual in the 2024/25 tax year?',
        options: [
          '£3,000',
          '£12,300',
          '£20,000',
          '£50,000'
        ],
        answer: 0,
        explanation: 'For the 2024/25 tax year, the UK CGT annual exemption is £3,000 per individual.'
      },
      {
        question: 'What is the current UK Dividend Allowance for dividends received outside an ISA in the 2024/25 tax year?',
        options: [
          '£500',
          '£2,000',
          '£5,000',
          'Zero allowance'
        ],
        answer: 0,
        explanation: 'The dividend allowance was reduced to £500 per tax year for dividends received outside tax-sheltered accounts.'
      },
      {
        question: 'What is the rate of Stamp Duty Reserve Tax (SDRT) when buying individual UK electronic shares on the London Stock Exchange?',
        options: [
          '0.5%',
          '5.0%',
          '10.0%',
          'Zero percent'
        ],
        answer: 0,
        explanation: 'A 0.5% SDRT charge applies when purchasing individual UK shares electronically (most ETFs and overseas equities are exempt).'
      }
    ]
  }
];

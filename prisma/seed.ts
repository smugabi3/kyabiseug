import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CATEGORY_DEFS } from "../src/lib/categories";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SAMPLE_VIDEO = "https://www.youtube.com/embed/aqz-KE-bpKQ";

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

function p(...paragraphs: string[]) {
  return paragraphs.map((t) => `<p>${t}</p>`).join("\n");
}

type SeedArticle = {
  slug: string;
  title: string;
  dek: string;
  content: string;
  author: string;
  location?: string;
  tags?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isVideo?: boolean;
  daysAgo: number;
  views: number;
};

const local: SeedArticle[] = [
  {
    slug: "kampala-jinja-expressway-nears-completion",
    title: "Kampala–Jinja Expressway Nears Completion as Government Eyes Early 2027 Opening",
    dek: "The 77km tolled highway is now more than 90 percent complete, with officials promising it will cut travel time between the two cities to under an hour.",
    content: p(
      "The long-awaited Kampala–Jinja Expressway is entering its final construction phase, with the Uganda National Roads Authority (UNRA) confirming that more than 90 percent of civil works have been completed.",
      'Speaking at a site inspection in Mukono on Tuesday, UNRA executive director Allen Kagina said the remaining work involves surface asphalting, toll plaza installation and safety signage. "Barring any unforeseen delays, motorists should be using this road by the first quarter of next year," she told reporters.',
      "The four-lane expressway is expected to reduce travel time between Kampala and Jinja from roughly two hours to under 45 minutes, easing pressure on the congested Northern Bypass and Jinja Road corridor that currently handles over 18,000 vehicles a day.",
      "Local leaders in Mukono and Buikwe districts have welcomed the project, though some traders along the old route have raised concerns about lost business once traffic shifts to the new highway. UNRA says a compensation and resettlement review is ongoing for the last remaining affected households."
    ),
    author: "Sarah Nakato",
    location: "Mukono",
    tags: "expressway,infrastructure,UNRA,Kampala,Jinja",
    isBreaking: true,
    isFeatured: true,
    daysAgo: 0,
    views: 4210,
  },
  {
    slug: "parliament-passes-digital-land-registration-bill",
    title: "Parliament Passes Landmark Bill on Digital Land Registration",
    dek: "The new law will require all land transactions to be processed through an electronic registry, aimed at cutting fraud and speeding up title processing.",
    content: p(
      "Parliament on Thursday passed the Land (Amendment) Bill 2026, paving the way for a fully digital national land registry that officials say will curb the rampant fraud that has plagued Uganda's land sector for decades.",
      "Under the new law, all land transfers, mortgages and title searches must be conducted through the Ministry of Lands' online portal, with physical land files to be phased out within three years.",
      'Lands Minister Judith Nabakooba told the House the reform was long overdue. "Too many families have lost land to forged titles and multiple sales of the same plot. A digital, tamper-evident registry closes that loophole," she said.',
      "Civil society groups cautiously welcomed the bill but called for safeguards to ensure rural landholders without reliable internet access are not left behind during the transition."
    ),
    author: "David Okello",
    location: "Kampala",
    tags: "parliament,land,digital,policy",
    daysAgo: 1,
    views: 2870,
  },
  {
    slug: "floods-displace-hundreds-kasese",
    title: "Fresh Floods Displace Hundreds in Kasese District",
    dek: "Heavy rains over the Rwenzori ranges have burst the banks of the Nyamwamba River, forcing families from their homes for the third time in two years.",
    content: p(
      "Hundreds of families in Kasese District have been displaced after the Nyamwamba River burst its banks following days of heavy rainfall over the Rwenzori Mountains.",
      "The Uganda Red Cross Society said at least 340 households in Kilembe and Bulembia divisions had been affected, with emergency shelters set up at two primary schools.",
      '"We are appealing for blankets, clean water and sanitary supplies as the number of displaced people continues to rise," said Red Cross spokesperson Irene Nakasiita.',
      "District officials have renewed calls for the completion of a long-delayed river training project meant to control seasonal flooding in the area."
    ),
    author: "Grace Auma",
    location: "Kasese",
    tags: "floods,disaster,Rwenzori,relief",
    daysAgo: 1,
    views: 1980,
  },
  {
    slug: "kcca-boda-boda-registration-drive",
    title: "Kampala City Authority Rolls Out New Boda Boda Registration Drive",
    dek: "KCCA says the exercise will bring order to the sector and improve rider safety records ahead of a planned digital fare and insurance scheme.",
    content: p(
      "The Kampala Capital City Authority (KCCA) has launched a fresh registration drive for boda boda riders, targeting an estimated 250,000 motorcycles operating in the city.",
      "Riders will be issued digital identification linked to their number plates, which authorities say will help track accidents, enforce safety standards and eventually support a planned rider insurance scheme.",
      'KCCA\'s Director of Gender, Community Services and Production, Andrew Kitaka, said the registration is free for the first month. "We want every rider captured in the system by the end of the year," he said.',
      "Boda boda associations have generally backed the move, though some riders say they fear it could be used to justify new fees down the line."
    ),
    author: "Peter Ssemwogerere",
    location: "Kampala",
    tags: "KCCA,boda boda,transport,safety",
    daysAgo: 2,
    views: 1540,
  },
  {
    slug: "mbarara-regional-trade-expo",
    title: "Mbarara Set to Host Regional Trade Expo Next Month",
    dek: "Organisers expect over 300 exhibitors from Uganda, Rwanda and DR Congo at the western region's largest trade fair in five years.",
    content: p(
      "Mbarara City will host the Western Uganda Regional Trade Expo next month, bringing together manufacturers, agro-processors and cross-border traders from Uganda, Rwanda and eastern DR Congo.",
      "The five-day event, organised with the Uganda Manufacturers Association, is expected to draw more than 300 exhibitors and thousands of visitors to the city's showgrounds.",
      '"This expo is about connecting western Uganda\'s producers directly to regional markets," said UMA regional coordinator Patience Kembabazi.',
      "Local hoteliers say bookings are already filling up, with the city's business community hoping the event becomes an annual fixture."
    ),
    author: "Ritah Namutebi",
    location: "Mbarara",
    tags: "trade,expo,business,western region",
    daysAgo: 3,
    views: 980,
  },
  {
    slug: "wakiso-water-shortage-nwsc-repairs",
    title: "Water Shortage Hits Parts of Wakiso as NWSC Repairs Main Pipeline",
    dek: "The National Water and Sewerage Corporation says supply will be restored within 48 hours after a burst main disrupted service to over 40,000 connections.",
    content: p(
      "Residents in several Wakiso District suburbs have gone without piped water for two days following a burst on a major distribution main near Kira.",
      "The National Water and Sewerage Corporation (NWSC) said emergency repair crews were on site and expected to restore full supply within 48 hours.",
      '"We apologise for the inconvenience and have deployed water bowsers to the worst-affected areas in the meantime," NWSC said in a statement.',
      "The affected areas include parts of Kira, Namugongo and Bweyogerere, home to tens of thousands of households and small businesses."
    ),
    author: "Brian Kato",
    location: "Wakiso",
    tags: "water,NWSC,infrastructure",
    daysAgo: 4,
    views: 760,
  },
];

const international: SeedArticle[] = [
  {
    slug: "au-summit-addis-ababa-regional-trade",
    title: "African Union Summit Opens in Addis Ababa With Focus on Regional Trade",
    dek: "Heads of state are meeting to review progress on the African Continental Free Trade Area, now in its sixth year of implementation.",
    content: p(
      "African Union leaders convened in Addis Ababa on Monday for the organisation's annual summit, with the African Continental Free Trade Area (AfCFTA) topping the agenda.",
      "AU Commission chairperson Moussa Faki Mahamat told delegates that intra-African trade has grown steadily since the agreement took effect, but urged member states to speed up tariff reforms and border infrastructure investment.",
      "Uganda's delegation, led by the Minister of Trade, is expected to push for greater support for landlocked economies that rely on neighbouring ports and transit corridors.",
      "The three-day summit will also address regional security concerns in the Sahel and the Horn of Africa."
    ),
    author: "Josephine Achieng",
    tags: "African Union,AfCFTA,trade,diplomacy",
    isFeatured: true,
    daysAgo: 0,
    views: 3120,
  },
  {
    slug: "eac-single-currency-roadmap-talks",
    title: "East African Community Leaders Meet to Discuss Single Currency Roadmap",
    dek: "Finance ministers from the six-nation bloc reviewed convergence targets needed before a common currency can be introduced.",
    content: p(
      "Finance ministers from the East African Community met in Arusha this week to assess progress toward a proposed EAC single currency, a project first outlined more than a decade ago.",
      'A joint communique said member states have made "uneven progress" on the macroeconomic convergence criteria, including inflation and public debt targets, needed before a monetary union can proceed.',
      "Uganda's central bank governor said the country remains broadly on track but flagged the need for tighter fiscal coordination across the bloc.",
      "Officials did not set a new target date for the currency's introduction, with the original 2024 timeline having already lapsed."
    ),
    author: "Moses Tumwine",
    tags: "EAC,currency,economy,finance",
    daysAgo: 1,
    views: 1450,
  },
  {
    slug: "un-warns-food-insecurity-horn-of-africa",
    title: "UN Warns of Rising Food Insecurity Across the Horn of Africa",
    dek: "A new report says drought and conflict have pushed millions closer to crisis levels of hunger in Somalia, Ethiopia and South Sudan.",
    content: p(
      "The United Nations has warned that food insecurity across the Horn of Africa is worsening, with an estimated 23 million people facing acute hunger amid drought, conflict and economic shocks.",
      "The World Food Programme said funding shortfalls have forced ration cuts in several refugee settlements, including those hosting people who have fled into Uganda from South Sudan and DR Congo.",
      '"Without urgent new funding, we risk a repeat of the severe crises we saw earlier this decade," a WFP regional spokesperson said.',
      "Uganda currently hosts over 1.6 million refugees, one of the largest refugee populations in Africa."
    ),
    author: "Diana Nabukenya",
    tags: "United Nations,food security,humanitarian",
    daysAgo: 2,
    views: 1290,
  },
  {
    slug: "us-china-resume-trade-talks",
    title: "US and China Resume Trade Talks Amid Global Market Jitters",
    dek: "Negotiators from both countries met in Geneva as investors watch for signs of easing tensions over tariffs and technology exports.",
    content: p(
      "Senior trade officials from the United States and China resumed negotiations in Geneva this week, aiming to defuse tensions that have unsettled global markets for much of the year.",
      "Analysts say the talks are focused on tariff schedules and export controls on semiconductor technology, issues that have had ripple effects on supply chains worldwide, including commodity exporters in Africa.",
      '"Any de-escalation would be welcome news for emerging markets that have felt the knock-on effects of this trade dispute," said one Kampala-based economic analyst.',
      'No joint statement had been issued as of Thursday, though both sides described the discussions as "constructive."'
    ),
    author: "Emmanuel Byaruhanga",
    tags: "United States,China,trade,markets",
    daysAgo: 3,
    views: 1680,
  },
  {
    slug: "kenya-tanzania-cross-border-infrastructure-pact",
    title: "Kenya, Tanzania Sign New Cross-Border Infrastructure Pact",
    dek: "The agreement covers a joint railway feasibility study and simplified customs procedures at key border posts.",
    content: p(
      "Kenya and Tanzania have signed a new infrastructure cooperation agreement covering a feasibility study for a cross-border railway link and streamlined customs procedures at the Namanga and Horohoro border posts.",
      "The deal is part of a broader East African push to reduce the cost and time of moving goods across the region, an issue that has long affected Uganda's import and export trade given its reliance on the Mombasa and Dar es Salaam corridors.",
      "Trade officials say a functioning single customs territory could cut cargo clearance times by up to 40 percent.",
      "Construction, if approved, would not begin before 2028, according to officials familiar with the study's timeline."
    ),
    author: "Sarah Nakato",
    tags: "Kenya,Tanzania,railway,customs",
    daysAgo: 4,
    views: 890,
  },
  {
    slug: "world-leaders-climate-talks-emissions",
    title: "World Leaders Gather for Climate Talks as Emission Targets Slip",
    dek: "New data shows most G20 economies are falling behind their 2030 emissions pledges, raising pressure ahead of this year's climate summit.",
    content: p(
      "Delegates from nearly 190 countries are gathering this week for the latest round of UN climate talks, amid fresh data showing most major economies are off track to meet their 2030 emissions targets.",
      "African negotiators, including Uganda's delegation, are expected to press wealthier nations on long-promised climate adaptation financing, which has consistently fallen short of pledged amounts.",
      '"Communities here are already living with the impact of erratic rainfall and prolonged droughts. The financing gap is not abstract to us," said a member of Uganda\'s negotiating team.',
      "A final agreement on new financing commitments is expected before the summit closes next week."
    ),
    author: "Grace Auma",
    tags: "climate change,COP,environment",
    daysAgo: 5,
    views: 1120,
  },
];

const business: SeedArticle[] = [
  {
    slug: "uganda-shilling-steadies-central-bank-intervention",
    title: "Uganda Shilling Steadies After Central Bank Intervention",
    dek: "The Bank of Uganda sold dollars on the interbank market to curb a slide that had pushed the shilling to its weakest level in over a year.",
    content: p(
      "The Ugandan shilling steadied against the US dollar on Thursday after the Bank of Uganda intervened in the interbank foreign exchange market, dealers said, halting a slide that had pushed the currency to its weakest level in more than a year.",
      'A central bank spokesperson confirmed the intervention but declined to disclose the volume of dollars sold. "Our objective is orderly market conditions, not defending a particular exchange rate," the spokesperson said.',
      "Analysts attributed the earlier pressure on the shilling to seasonal dollar demand from importers and businesses settling end-of-quarter obligations, combined with reduced inflows from coffee exports during the off-season.",
      "The shilling has weakened by roughly 4 percent against the dollar so far this year, broadly in line with other regional currencies."
    ),
    author: "Moses Tumwine",
    location: "Kampala",
    tags: "shilling,central bank,currency,economy",
    isBreaking: true,
    isFeatured: true,
    daysAgo: 0,
    views: 3410,
  },
  {
    slug: "coffee-exports-record-value-rising-prices",
    title: "Coffee Exports Hit Record Value Amid Rising Global Prices",
    dek: "Uganda earned more from coffee in the last financial year than ever before, driven by a global supply crunch that has pushed prices to decade highs.",
    content: p(
      "Uganda's coffee export earnings hit a record high in the last financial year, the Uganda Coffee Development Authority said, as a global supply crunch pushed international prices to their highest levels in over a decade.",
      "Export volumes grew modestly, but it was the sharp rise in world prices that drove earnings up by nearly a third compared to the previous year, cementing coffee's position as Uganda's single largest export earner.",
      '"Farmers are finally seeing prices that reflect the real cost and effort of growing quality coffee," said a UCDA official, while cautioning that smallholder farmers have not always captured the full benefit of the price rally.',
      "Industry players are now pushing for expanded value-addition, arguing that exporting more roasted and processed coffee rather than raw beans would capture significantly more value locally."
    ),
    author: "Sarah Nakato",
    tags: "coffee,exports,agriculture,trade",
    daysAgo: 1,
    views: 2240,
  },
  {
    slug: "kampala-stock-exchange-new-listing",
    title: "Kampala Stock Exchange Welcomes Newest Listed Company",
    dek: "An agribusiness processing firm became the latest company to list on the USE, in a move officials hope will encourage more local firms to go public.",
    content: p(
      "The Uganda Securities Exchange welcomed its newest listed company this week, as an agribusiness processing firm completed an initial public offering that was oversubscribed by local and regional investors.",
      "The listing is only the exchange's latest in several years, reflecting the slow pace at which Ugandan companies have historically turned to public markets for capital, typically preferring bank loans or private equity instead.",
      '"Every new listing helps deepen our capital markets and gives ordinary Ugandans a way to own a stake in companies they interact with every day," a USE official said at the listing ceremony.',
      "Market watchers say tax incentives for newly listed companies and growing interest from pension funds could encourage more firms to follow suit over the next few years."
    ),
    author: "David Okello",
    location: "Kampala",
    tags: "stock exchange,USE,investment,markets",
    daysAgo: 2,
    views: 1180,
  },
  {
    slug: "local-banks-strong-half-year-profits",
    title: "Local Banks Report Strong Half-Year Profits Despite Economic Headwinds",
    dek: "Uganda's largest commercial banks posted double-digit profit growth, driven by higher lending volumes and income from government securities.",
    content: p(
      "Several of Uganda's largest commercial banks reported double-digit profit growth for the first half of the year, according to financial statements released this week, defying concerns about a broader economic slowdown.",
      "Bank executives pointed to growing loan books, particularly in agriculture and small business lending, along with strong returns on government securities, as the main drivers of the improved earnings.",
      '"We are seeing more businesses come to us for working capital as trade activity picks up," said one bank\'s chief finance officer during an investor briefing.',
      "Non-performing loans remained broadly stable across the sector, though analysts cautioned that asset quality should be watched closely if interest rates stay elevated for an extended period."
    ),
    author: "Emmanuel Byaruhanga",
    tags: "banking,profits,finance",
    daysAgo: 3,
    views: 1650,
  },
  {
    slug: "uganda-rwanda-cross-border-trade-deal",
    title: "Uganda, Rwanda Sign New Trade Deal to Boost Cross-Border Commerce",
    dek: "The agreement simplifies customs procedures at key border posts, part of a broader push to normalise trade relations between the two countries.",
    content: p(
      "Uganda and Rwanda signed a new trade facilitation agreement this week aimed at simplifying customs procedures at the Katuna and Mirama Hills border posts, a further sign of warming trade relations between the two neighbours.",
      "The deal is expected to cut clearance times for traders moving goods between the two countries, who have in recent years faced periodic border closures and stricter checks that disrupted commerce.",
      '"Every day a truck sits at the border is money lost for a trader who is often operating on thin margins," said a Uganda Revenue Authority official involved in the negotiations.',
      "Business associations on both sides of the border welcomed the agreement, though some traders said they would wait to see how consistently it is implemented before adjusting their supply chains."
    ),
    author: "Grace Auma",
    tags: "trade,Rwanda,cross-border,customs",
    daysAgo: 4,
    views: 940,
  },
  {
    slug: "tourism-revenue-rebounds-pre-pandemic",
    title: "Tourism Revenue Rebounds to Pre-Pandemic Levels, Officials Say",
    dek: "Earnings from tourism have fully recovered from the pandemic-era slump, driven by rising visitor numbers to national parks and a weaker shilling.",
    content: p(
      "Uganda's tourism sector has fully recovered from its pandemic-era collapse, with earnings surpassing pre-pandemic levels for the first time, the Uganda Tourism Board said in its latest sector report.",
      "Visitor numbers to national parks, particularly for gorilla trekking permits in Bwindi Impenetrable Forest, have climbed steadily over the past two years, with operators reporting near-full bookings during peak season.",
      '"A weaker shilling has, ironically, worked in our favour by making Uganda a more competitively priced destination for international visitors," a tourism board official said.',
      "Industry players are now calling for continued investment in road access to key parks and additional flight connections, arguing that infrastructure remains the biggest constraint on further growth."
    ),
    author: "Ritah Namutebi",
    tags: "tourism,economy,national parks",
    daysAgo: 5,
    views: 1370,
  },
];

const sports: SeedArticle[] = [
  {
    slug: "uganda-cranes-world-cup-qualifier-winner",
    title: "Uganda Cranes Book World Cup Qualifier Slot With Dramatic Late Winner",
    dek: "A stoppage-time strike from captain Milton Karisa sent fans in Namboole into raptures and kept Uganda's qualification hopes alive.",
    content: p(
      "The Uganda Cranes secured a crucial 2-1 victory in a packed Mandela National Stadium on Tuesday night, with captain Milton Karisa scoring a dramatic 92nd-minute winner to keep the country's World Cup qualification hopes firmly on track.",
      "The result lifts Uganda to second in their qualifying group, level on points with the leaders with two matches remaining.",
      '"This team has heart. We never stopped believing, even when we went behind," head coach Paul Put said after the match.',
      "Fans flooded the streets of Kampala in celebration late into the night, with the next qualifier away from home set for next month."
    ),
    author: "Peter Ssemwogerere",
    location: "Kampala",
    tags: "Uganda Cranes,football,World Cup qualifiers",
    isBreaking: true,
    isFeatured: true,
    isVideo: true,
    daysAgo: 0,
    views: 6720,
  },
  {
    slug: "cheptegei-diamond-league-finale-record",
    title: "Joshua Cheptegei Eyes New Record at Diamond League Finale",
    dek: "The Olympic and world champion says he is in the best shape of his career heading into the season-ending meet in Brussels.",
    content: p(
      "Olympic 10,000m champion Joshua Cheptegei says he is targeting another personal best as he heads into the Diamond League finale in Brussels this weekend.",
      '"Training has gone exactly to plan this season. I believe there\'s more time to take off," Cheptegei told reporters ahead of the meet.',
      "The Ugandan star has dominated long-distance running for much of the past five years and remains a strong favourite heading into the final Diamond League meeting of the year.",
      "A strong showing would cap what has already been a record-breaking season for Ugandan athletics on the global stage."
    ),
    author: "Moses Tumwine",
    tags: "athletics,Joshua Cheptegei,Diamond League",
    isVideo: true,
    daysAgo: 1,
    views: 2340,
  },
  {
    slug: "kcca-fc-signs-teenage-striker",
    title: "KCCA FC Signs Promising Teenage Striker Ahead of New Season",
    dek: "The 17-year-old forward joins from a Kampala-based academy after a standout youth league campaign.",
    content: p(
      "KCCA FC has completed the signing of highly-rated 17-year-old striker Ronald Kirya from a local football academy, ahead of the new Ugandan Premier League season.",
      "Kirya finished as the top scorer in the national youth league last season with 21 goals in 18 matches.",
      '"He has raw talent and a hunger to learn. We believe he can grow into a real asset for this club," said KCCA FC head coach.',
      "The club's pre-season training camp begins next week as they prepare for a title challenge."
    ),
    author: "Brian Kato",
    tags: "KCCA FC,football,transfers",
    daysAgo: 2,
    views: 1670,
  },
  {
    slug: "she-cranes-africa-cup-defense-prep",
    title: "Uganda Netball 'She Cranes' Prepare for Africa Cup Defense",
    dek: "The reigning champions have named a 14-player squad for a training camp ahead of next month's continental tournament.",
    content: p(
      "Uganda's national netball team, the She Cranes, have named their squad for a two-week training camp as they prepare to defend their African Netball Cup title.",
      "Head coach Fred Mugerwa said the squad blends experienced internationals with several uncapped players from the domestic league.",
      '"Defending a title is always harder than winning it the first time. We are taking nothing for granted," Mugerwa said.',
      "The She Cranes have been one of Uganda's most consistent international teams in recent years, regularly ranking among the top sides in Africa."
    ),
    author: "Diana Nabukenya",
    tags: "netball,She Cranes,Africa Cup",
    daysAgo: 3,
    views: 940,
  },
  {
    slug: "rugby-cranes-win-kenya-simbas",
    title: "Rugby Cranes Secure Historic Win Over Kenya Simbas",
    dek: "Uganda's national rugby team claimed a first away victory over their regional rivals in over a decade.",
    content: p(
      "Uganda's national rugby sevens side, the Rugby Cranes, secured a historic 24-19 away win over Kenya's Simbas, their first victory in Nairobi in more than ten years.",
      "The result is a major boost for Ugandan rugby, which has invested heavily in youth development programmes over the past five years.",
      '"This win belongs to every young player who has come through our academy system," said team captain after the match.',
      "The Rugby Cranes now turn their attention to continental sevens qualifiers later this year."
    ),
    author: "Emmanuel Byaruhanga",
    tags: "rugby,Rugby Cranes,Kenya",
    daysAgo: 4,
    views: 1080,
  },
  {
    slug: "local-boxer-commonwealth-title-shot",
    title: "Local Boxing Star Eyes Commonwealth Title Shot in Manchester",
    dek: "Kampala-born welterweight contender has been confirmed as the mandatory challenger for next year's title fight.",
    content: p(
      "Kampala-born welterweight boxer Ismail Kiwanuka has been confirmed as the mandatory challenger for the Commonwealth welterweight title, with the bout set for Manchester next spring.",
      'Kiwanuka, unbeaten in his last nine fights, said the opportunity was "a dream come true" after years of competing on the domestic and regional circuit.',
      "\"I've worked for this since I was a kid training in Katwe. Now it's here and I intend to bring that belt home,\" he said.",
      "Uganda Boxing Federation officials say the fight could be a major moment for the sport's profile in the country."
    ),
    author: "Ritah Namutebi",
    tags: "boxing,Commonwealth,Kampala",
    daysAgo: 5,
    views: 720,
  },
];

const health: SeedArticle[] = [
  {
    slug: "ministry-health-malaria-vaccination-drive",
    title: "Ministry of Health Launches Nationwide Malaria Vaccination Drive",
    dek: "The rollout targets children under five in 87 districts, building on a successful pilot programme launched two years ago.",
    content: p(
      "The Ministry of Health has launched a nationwide rollout of the malaria vaccine, expanding a pilot programme that began in select districts two years ago to cover children under five across all 87 target districts.",
      "Health Minister Dr Jane Ruth Aceng said the vaccine, used alongside bed nets and indoor spraying, is expected to significantly reduce severe malaria cases among young children.",
      '"Malaria remains one of the leading causes of death among children under five in Uganda. This vaccine is a critical additional tool, not a replacement for existing prevention methods," she said.',
      "The ministry says over 2 million doses have been secured for this phase of the campaign, with support from international health partners."
    ),
    author: "Josephine Achieng",
    tags: "malaria,vaccination,Ministry of Health",
    isFeatured: true,
    daysAgo: 0,
    views: 3450,
  },
  {
    slug: "rising-non-communicable-disease-cases",
    title: "Doctors Warn of Rising Non-Communicable Disease Cases in Uganda",
    dek: "New hospital data shows a sharp increase in diabetes and hypertension diagnoses over the past five years, particularly in urban areas.",
    content: p(
      "Doctors at several major hospitals in Kampala are warning of a steady rise in non-communicable diseases such as diabetes, hypertension and certain cancers, with urban lifestyle changes cited as a key driver.",
      "Data reviewed from Mulago National Referral Hospital shows outpatient visits related to hypertension have nearly doubled over the past five years.",
      '"We are seeing patients in their 30s with conditions we used to associate mainly with much older age groups," said a senior physician at the hospital.',
      "Health officials are calling for expanded screening programmes and public awareness campaigns around diet and physical activity."
    ),
    author: "David Okello",
    tags: "health,non-communicable disease,Mulago",
    daysAgo: 1,
    views: 1560,
  },
  {
    slug: "mulago-cancer-wing-opens",
    title: "New Mulago Cancer Wing Opens, Boosting Treatment Capacity",
    dek: "The expanded oncology unit adds 120 beds and new radiotherapy equipment, cutting wait times for cancer patients.",
    content: p(
      "A new cancer treatment wing at Mulago National Referral Hospital officially opened this week, adding 120 beds and two new radiotherapy machines to the country's cancer care capacity.",
      "The expansion is expected to significantly reduce waiting times at the Uganda Cancer Institute, which has struggled with high patient volumes relative to available equipment.",
      '"This is one of the most significant investments in cancer care Uganda has made in a decade," said a hospital administrator at the opening ceremony.',
      "Officials say a further expansion focused on pediatric oncology is planned for next year."
    ),
    author: "Grace Auma",
    location: "Kampala",
    tags: "Mulago,cancer,healthcare",
    daysAgo: 2,
    views: 1980,
  },
  {
    slug: "mental-health-awareness-week-kampala",
    title: "Mental Health Awareness Week Kicks Off Across Kampala",
    dek: "The week-long campaign includes free counselling sessions and public talks aimed at reducing stigma around mental illness.",
    content: p(
      "Mental Health Awareness Week began in Kampala on Monday, with free counselling sessions, public talks and school outreach programmes planned across the city.",
      "Organisers say the campaign aims to reduce stigma and encourage more people to seek help for anxiety, depression and other mental health conditions.",
      '"Mental health has long been overlooked in our healthcare conversations. This week is about changing that," said a clinical psychologist involved in the programme.',
      "Several private and public health facilities are offering discounted or free initial consultations throughout the week."
    ),
    author: "Ritah Namutebi",
    tags: "mental health,awareness,Kampala",
    daysAgo: 3,
    views: 890,
  },
  {
    slug: "sanitation-child-mortality-study",
    title: "Study Links Improved Sanitation to Drop in Child Mortality",
    dek: "Research across 40 districts found under-five mortality fell fastest in areas with expanded access to clean water and sanitation.",
    content: p(
      "A new study conducted across 40 districts has found a strong link between improved sanitation infrastructure and declining under-five mortality rates in Uganda.",
      "Researchers found that districts with expanded access to clean water and improved latrines saw child mortality rates fall nearly twice as fast as those without such investments.",
      '"This confirms what public health experts have long argued: sanitation is health infrastructure," said the study\'s lead author.',
      "The findings are expected to inform the next phase of the government's rural water and sanitation programme."
    ),
    author: "Moses Tumwine",
    tags: "sanitation,child health,research",
    daysAgo: 4,
    views: 760,
  },
  {
    slug: "who-commends-uganda-ebola-response",
    title: "WHO Commends Uganda's Response to Recent Ebola Scare",
    dek: "The World Health Organization praised rapid contact tracing that contained a suspected outbreak to a single district.",
    content: p(
      "The World Health Organization has commended Uganda's health authorities for a swift response to a suspected Ebola case that emerged in a central district last month, crediting rapid contact tracing for preventing wider spread.",
      "No further confirmed cases have been recorded since the initial alert, and the affected district has since been declared clear following the standard monitoring period.",
      '"Uganda\'s experience managing previous outbreaks meant response teams were able to move quickly and decisively," a WHO regional official said.',
      "Health officials say surveillance systems along border districts remain on heightened alert as a precaution."
    ),
    author: "Emmanuel Byaruhanga",
    tags: "Ebola,WHO,public health",
    daysAgo: 5,
    views: 1340,
  },
];

const tech: SeedArticle[] = [
  {
    slug: "uganda-fintech-startups-record-investment",
    title: "Uganda's Fintech Startups Attract Record Investment in 2026",
    dek: "Local fintech firms raised more than $85 million this year, driven by growing mobile money and digital lending adoption.",
    content: p(
      "Ugandan fintech startups have attracted a record $85 million in investment so far this year, according to a new report from a regional venture capital association, more than double the amount raised in 2024.",
      "Digital lending and mobile money interoperability platforms accounted for the largest share of funding, reflecting continued growth in Uganda's mobile-first financial services sector.",
      '"Investors are increasingly viewing Uganda as a serious fintech hub within East Africa, not just an extension of the Kenyan market," said one venture capital analyst.',
      "Industry leaders say regulatory clarity from the central bank has played a significant role in building investor confidence."
    ),
    author: "Diana Nabukenya",
    tags: "fintech,startups,investment",
    isFeatured: true,
    daysAgo: 0,
    views: 2870,
  },
  {
    slug: "digital-id-mobile-money-integration",
    title: "Government Launches Digital ID Integration for Mobile Money",
    dek: "The new system will let mobile money users verify their identity directly through the national ID database, cutting fraud and onboarding time.",
    content: p(
      "The government has launched a new integration between the National Identification and Registration Authority (NIRA) database and mobile money platforms, allowing users to verify their identity electronically when registering for new accounts.",
      "Officials say the system is designed to reduce identity fraud, a persistent challenge in Uganda's fast-growing mobile money sector, while also speeding up account registration.",
      '"This closes a major gap that fraudsters have exploited for years," said a NIRA official at the system\'s launch.',
      "Telecom operators say the integration will be rolled out to all registration agents nationwide over the coming months."
    ),
    author: "Brian Kato",
    tags: "digital ID,mobile money,NIRA",
    daysAgo: 1,
    views: 1650,
  },
  {
    slug: "solar-irrigation-kit-smallholder-farmers",
    title: "Local Innovators Unveil Solar-Powered Irrigation Kit for Smallholder Farmers",
    dek: "The low-cost kit, developed by a Kampala-based startup, aims to help farmers cut water costs and boost yields during dry seasons.",
    content: p(
      "A Kampala-based agri-tech startup has unveiled a solar-powered irrigation kit designed specifically for smallholder farmers, aiming to reduce reliance on costly diesel pumps.",
      "The kit, which pairs a compact solar panel with a drip irrigation system, is priced to be accessible to farmers working plots of one to five acres.",
      "\"We built this for farmers who've been priced out of irrigation technology. It should pay for itself within two growing seasons,\" said the startup's founder.",
      "Pilot programmes are currently underway in three districts, with plans to scale nationally next year pending additional funding."
    ),
    author: "Sarah Nakato",
    tags: "agri-tech,solar,farming,innovation",
    daysAgo: 2,
    views: 1120,
  },
  {
    slug: "mtn-airtel-5g-expansion-kampala",
    title: "MTN, Airtel Roll Out Expanded 5G Coverage in Kampala",
    dek: "Both telecoms say new coverage will extend to major business districts and university campuses by year end.",
    content: p(
      "Uganda's two largest telecom operators, MTN and Airtel, have announced expanded 5G network coverage across Kampala, with rollout extending to key business districts and university campuses by the end of the year.",
      "Both companies say the expansion is aimed at supporting growing demand for high-speed data among businesses and students, as well as positioning Uganda competitively within the region's digital economy.",
      '"5G is not just about faster browsing, it\'s about enabling new services in areas like telemedicine and remote learning," an MTN Uganda executive said.',
      "Coverage outside the capital remains limited, with operators citing infrastructure costs as the main barrier to nationwide rollout."
    ),
    author: "Peter Ssemwogerere",
    tags: "5G,MTN,Airtel,telecom",
    daysAgo: 3,
    views: 1430,
  },
  {
    slug: "makerere-ai-coffee-leaf-disease-tool",
    title: "Makerere Students Build AI Tool to Detect Coffee Leaf Disease",
    dek: "The smartphone app uses image recognition to identify common coffee diseases, aiming to help farmers act before crop losses spread.",
    content: p(
      "A team of computer science students at Makerere University has developed a smartphone application that uses artificial intelligence to detect common coffee leaf diseases from a single photograph.",
      "The app, trained on thousands of images of Ugandan coffee crops, can identify conditions such as coffee leaf rust and berry disease with over 90 percent accuracy in early testing.",
      '"Coffee is central to so many livelihoods here. Catching disease early can be the difference between a good harvest and a ruined one," said one of the student developers.',
      "The team is now working with the Uganda Coffee Development Authority to pilot the tool with farmer cooperatives in the Rwenzori region."
    ),
    author: "Grace Auma",
    tags: "AI,agriculture,Makerere,coffee",
    isVideo: true,
    daysAgo: 4,
    views: 1980,
  },
  {
    slug: "cybersecurity-agency-mobile-money-fraud-warning",
    title: "Cybersecurity Agency Warns of Rising Mobile Money Fraud Schemes",
    dek: "Officials report a sharp increase in SIM-swap and social engineering scams targeting mobile money users this quarter.",
    content: p(
      "Uganda's national cybersecurity agency has issued a public warning over a rise in mobile money fraud schemes, particularly SIM-swap attacks and social engineering scams targeting unsuspecting users.",
      "The agency reported a 30 percent increase in reported incidents this quarter compared to the same period last year.",
      '"Never share your PIN or one-time codes with anyone, including people claiming to be from your telecom provider," the agency said in its advisory.',
      "Telecom operators say they are working with law enforcement to strengthen verification procedures for SIM replacement requests."
    ),
    author: "Moses Tumwine",
    tags: "cybersecurity,fraud,mobile money",
    daysAgo: 5,
    views: 1050,
  },
];

const gospel: SeedArticle[] = [
  {
    slug: "kampala-worship-festival-kololo",
    title: "Thousands Attend Kampala Worship Festival at Kololo Grounds",
    dek: "The annual gospel gathering drew choirs and worship teams from across the region for a night of music and prayer.",
    content: p(
      "Tens of thousands of worshippers filled Kololo Ceremonial Grounds on Saturday night for the annual Kampala Worship Festival, one of the largest gospel gatherings on the region's calendar.",
      "The event featured performances from choirs and worship teams across Uganda, Kenya and Rwanda, along with prayer sessions led by local church leaders.",
      '"Nights like this remind us how much gospel music unites people across denominations and borders," said one of the festival\'s organisers.',
      "Organisers say next year's edition will expand to a two-night format due to overwhelming demand."
    ),
    author: "Josephine Achieng",
    location: "Kampala",
    tags: "gospel,worship,festival,Kololo",
    isFeatured: true,
    isVideo: true,
    daysAgo: 0,
    views: 2650,
  },
  {
    slug: "wilson-bugembe-new-album-tour",
    title: "Gospel Artist Wilson Bugembe Announces New Album and National Tour",
    dek: "The award-winning singer says the project reflects a season of personal growth and will be accompanied by a 10-city tour.",
    content: p(
      "Renowned gospel artist Wilson Bugembe has announced the release of a new album, his first full-length project in three years, alongside a ten-city national tour set to begin next month.",
      '"This album came out of a season of real reflection. I believe it will speak to a lot of people going through their own seasons," Bugembe said at the announcement event.',
      "The tour will visit major towns including Jinja, Mbarara, Gulu and Mbale, with the Kampala leg planned as the closing show.",
      "Bugembe remains one of Uganda's most influential gospel artists, with several of his songs becoming staples in churches across East Africa."
    ),
    author: "Ritah Namutebi",
    tags: "Wilson Bugembe,gospel music,album",
    daysAgo: 1,
    views: 1870,
  },
  {
    slug: "church-leaders-unity-national-prayer-breakfast",
    title: "Church Leaders Call for Unity Ahead of National Prayer Breakfast",
    dek: "Denominational leaders met this week to plan the annual event, urging Ugandans to set aside differences for a common day of prayer.",
    content: p(
      "Leaders from Uganda's major church denominations met in Kampala this week to plan this year's National Prayer Breakfast, calling for greater unity among Christians ahead of the event.",
      '"Our nation faces real challenges. This is a moment for the Church to stand together, not apart," said one bishop involved in the planning committee.',
      "The National Prayer Breakfast, held annually, typically draws senior government officials, diplomats and religious leaders from across denominations.",
      "This year's event is scheduled to take place next month at a venue in Kampala yet to be announced."
    ),
    author: "David Okello",
    tags: "church,prayer breakfast,unity",
    daysAgo: 2,
    views: 940,
  },
  {
    slug: "youth-revival-crusade-mbale",
    title: "Youth Revival Crusade Draws Record Crowds in Mbale",
    dek: "The three-day event featured youth choirs, testimonies and evening crusades led by visiting evangelists.",
    content: p(
      "A three-day youth revival crusade in Mbale drew record crowds this week, with organisers estimating attendance of over 15,000 people on the closing night alone.",
      "The event featured performances from youth choirs, personal testimonies and evening sermons led by a lineup of visiting evangelists from across the region.",
      '"We wanted to create a space where young people could encounter faith in a way that feels alive and relevant to them," said the crusade\'s lead organiser.',
      "Local church leaders say interest in youth-focused gospel events has grown steadily across eastern Uganda in recent years."
    ),
    author: "Brian Kato",
    location: "Mbale",
    tags: "youth,revival,crusade,Mbale",
    daysAgo: 3,
    views: 780,
  },
  {
    slug: "ugandan-gospel-choir-east-africa-awards",
    title: "Ugandan Gospel Choir Wins Award at East Africa Music Awards",
    dek: "The Kampala-based choir took home the Best Gospel Group award, its second continental recognition in three years.",
    content: p(
      "A Kampala-based gospel choir has won the Best Gospel Group award at this year's East Africa Music Awards, held in Nairobi, marking its second continental recognition in three years.",
      "The choir's director said the award reflected years of disciplined rehearsal and a commitment to original Ugandan gospel compositions rather than covers.",
      '"We wanted to show that Ugandan gospel music can stand on its own on a regional stage," the director said after the ceremony.',
      "The group is now preparing to release its third studio album early next year."
    ),
    author: "Emmanuel Byaruhanga",
    tags: "gospel,award,music,East Africa",
    daysAgo: 4,
    views: 1150,
  },
  {
    slug: "documentary-gospel-music-growth-uganda",
    title: "New Documentary Chronicles the Growth of Gospel Music in Uganda",
    dek: "The hour-long film traces the genre's evolution from church choirs in the 1990s to today's chart-topping gospel artists.",
    content: p(
      "A new documentary tracing the evolution of Ugandan gospel music premiered in Kampala this week, featuring interviews with pioneering artists, producers and church leaders.",
      "The hour-long film covers the genre's growth from small church choirs in the 1990s to today's professionally produced gospel artists who regularly top national and regional charts.",
      '"Gospel music here has its own story, distinct from what you see in Nigeria or the US. This film is about honouring that story," the director said.',
      "The documentary will be screened in select cinemas before being made available online."
    ),
    author: "Diana Nabukenya",
    tags: "documentary,gospel music,culture",
    daysAgo: 5,
    views: 690,
  },
];

const entertainment: SeedArticle[] = [
  {
    slug: "eddy-kenzo-afrobeats-collaboration",
    title: "Eddy Kenzo Announces Collaboration With International Afrobeats Star",
    dek: "The Grammy-nominated Ugandan singer says the joint single is set for release later this month, with a music video shot partly in Kampala.",
    content: p(
      "Grammy-nominated singer Eddy Kenzo has announced a new collaboration with a leading Afrobeats star, with the joint single set for release later this month.",
      "Kenzo said the track blends Ugandan dance rhythms with West African production styles, and that part of the accompanying music video was filmed in Kampala.",
      '"This is about showing the world that African music is one big family, no matter which country it comes from," Kenzo said in an interview.',
      "The singer's global profile has grown steadily since his 2015 hit 'Sitya Loss' became an international viral sensation."
    ),
    author: "Ritah Namutebi",
    tags: "Eddy Kenzo,music,Afrobeats",
    isFeatured: true,
    daysAgo: 0,
    views: 5230,
  },
  {
    slug: "kampala-fashion-week-sustainable-design",
    title: "Kampala Fashion Week Returns With Focus on Sustainable Design",
    dek: "This year's edition spotlights designers using recycled and locally sourced materials, part of a growing sustainability push in the industry.",
    content: p(
      "Kampala Fashion Week returned this week with a strong focus on sustainability, showcasing designers who work primarily with recycled fabrics and locally sourced materials.",
      "Organisers said the shift reflects a broader movement within East Africa's fashion industry toward more environmentally conscious production.",
      '"Consumers, especially younger ones, are asking harder questions about where their clothes come from. Designers are responding," said the event\'s creative director.',
      "The week-long event closes with a showcase featuring collections from over 30 designers from Uganda and neighbouring countries."
    ),
    author: "Grace Auma",
    location: "Kampala",
    tags: "fashion,sustainability,design",
    daysAgo: 1,
    views: 1670,
  },
  {
    slug: "ugandan-film-bwino-international-festival",
    title: "Ugandan Film 'Bwino' Selected for International Film Festival",
    dek: "The drama, shot entirely on location in Kampala and Jinja, will compete in the festival's African cinema category.",
    content: p(
      "A Ugandan feature film, 'Bwino,' has been selected to screen at an international film festival, competing in the African cinema category alongside entries from a dozen other countries.",
      "The drama, shot entirely on location in Kampala and Jinja, follows a young entrepreneur navigating family expectations and personal ambition.",
      '"This film is deeply Ugandan in its setting and story, but the themes are ones anyone can relate to," said the film\'s director.',
      "It marks one of the highest-profile international selections for a Ugandan-made film in recent years."
    ),
    author: "Moses Tumwine",
    tags: "film,cinema,Bwino",
    isVideo: true,
    daysAgo: 2,
    views: 1340,
  },
  {
    slug: "comedy-store-kampala-10-years",
    title: "Comedy Store Kampala Marks 10 Years With Star-Studded Show",
    dek: "The long-running comedy night celebrated a decade on stage with performances from past and present cast members.",
    content: p(
      "Comedy Store Kampala celebrated ten years of weekly shows with a special anniversary performance featuring past and present cast members at a packed venue in the city centre.",
      "The show has become a fixture of Kampala's entertainment scene, launching the careers of several comedians now known across East Africa.",
      "\"Ten years of making people laugh every week, that's something we're incredibly proud of,\" said one of the show's founding members.",
      "Organisers say plans are underway for a regional tour to mark the milestone."
    ),
    author: "Peter Ssemwogerere",
    tags: "comedy,entertainment,Kampala",
    daysAgo: 3,
    views: 980,
  },
  {
    slug: "kampala-farm-to-table-dining-scene",
    title: "Top Chef Spotlight: The Rise of Kampala's Farm-to-Table Dining Scene",
    dek: "A new wave of restaurants is partnering directly with local farmers, reshaping how the city eats out.",
    content: p(
      "A growing number of Kampala restaurants are building menus around direct partnerships with local farmers, part of a broader farm-to-table movement reshaping the city's dining scene.",
      "Chefs say the shift is driven both by demand for fresher ingredients and a desire to support smallholder farmers directly rather than relying solely on wholesale markets.",
      '"When you know exactly which farm your vegetables came from that morning, it changes how you cook," said one Kampala-based chef leading the trend.',
      "The movement has also spurred a handful of new weekend farmers' markets popping up around the city."
    ),
    author: "Sarah Nakato",
    tags: "food,dining,lifestyle",
    daysAgo: 4,
    views: 1210,
  },
  {
    slug: "uganda-entertainment-awards-nominations",
    title: "Radio and TV Personalities Nominated for Uganda Entertainment Awards",
    dek: "This year's nomination list features a mix of veteran broadcasters and rising digital-first content creators.",
    content: p(
      "Nominations for this year's Uganda Entertainment Awards were released this week, featuring a mix of veteran radio and television personalities alongside a growing number of digital-first content creators.",
      "Organisers say the inclusion of online creators reflects changing viewing habits, with many young Ugandans now consuming entertainment content primarily through social media.",
      '"The lines between traditional broadcast and digital content have basically disappeared. Our nominations needed to reflect that," an awards committee spokesperson said.',
      "The winners will be announced at a ceremony in Kampala next month."
    ),
    author: "Brian Kato",
    tags: "awards,television,radio,digital media",
    daysAgo: 5,
    views: 860,
  },
];

const ALL: Record<string, SeedArticle[]> = {
  local,
  international,
  business,
  sports,
  health,
  tech,
  gospel,
  entertainment,
};

async function main() {
  console.log("Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const def of CATEGORY_DEFS) {
    const category = await prisma.category.upsert({
      where: { slug: def.slug },
      update: { name: def.name, description: def.description, color: def.color },
      create: def,
    });
    categoryMap[def.slug] = category.id;
  }

  console.log("Seeding articles...");
  const now = Date.now();
  for (const [slug, articles] of Object.entries(ALL)) {
    for (const a of articles) {
      const publishedAt = new Date(now - a.daysAgo * 24 * 60 * 60 * 1000);
      await prisma.article.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          slug: a.slug,
          title: a.title,
          dek: a.dek,
          content: a.content,
          coverImage: img(a.slug),
          videoUrl: a.isVideo ? SAMPLE_VIDEO : null,
          isBreaking: a.isBreaking ?? false,
          isFeatured: a.isFeatured ?? false,
          isVideo: a.isVideo ?? false,
          published: true,
          publishedAt,
          views: a.views,
          author: a.author,
          location: a.location,
          tags: a.tags,
          categoryId: categoryMap[slug],
        },
      });
    }
  }

  console.log("Seed complete. Run `npm run admin:create` to set up your admin account.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

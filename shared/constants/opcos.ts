export interface Opco {
  name: string;
  logo: string;
  url?: string;
  simulatorUrl?: string;
}

export interface OpcoIdcc {
  idcc: string;
  opco: string;
}

export const opcos: Record<string, Opco> = {
  "OPCO 2i": { logo: "opco2i.png", name: "OPCO 2i", url: "https://www.opco2i.fr/" },
  AFDAS: {
    logo: "opcoafdas.png",
    name: "AFDAS",
    simulatorUrl: "https://www.afdas.com/rubrique-modele/calculalternance.html",
  },
  OCAPIAT: {
    logo: "ocapiat.png",
    name: "OCAPIAT",
    simulatorUrl: "https://www.ocapiat.fr/capalt/simulateur-alternance/",
  },
  "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre": {
    logo: "opcoakto.png",
    name: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
    simulatorUrl: "https://www.akto.fr/calcul-cout-contrat-apprentissage/",
  },
  "OPCO entreprises de proximité": {
    logo: "opcoep.png",
    name: "OPCO entreprises de proximité",
    simulatorUrl: "https://hub-alternance.opcoep.fr/entreprise/simulateur-alternance",
  },
  "OPCO Santé": {
    logo: "opcosante.png",
    name: "OPCO Santé",
    simulatorUrl: "https://www.opco-sante.fr/opcomparateur-loutil-qui-permet-de-simuler-le-cout-de-votre-alternant",
  },
  "OPCO ATLAS": {
    logo: "opcoatlas.png",
    name: "OPCO ATLAS",
    simulatorUrl: "https://www.opco-atlas.fr/simulateur-cout-contrat-alternance",
  },
  "OPCO Mobilité": {
    logo: "opcomobilite.png",
    name: "OPCO Mobilité",
    url: "https://www.opcomobilites.fr/entreprise/espace-entreprise",
  },
  "OPCO Commerce": { logo: "opcommerce.png", name: "OPCO Commerce", url: "https://www.lopcommerce.com/" },
  "OPCO Cohésion sociale": {
    logo: "opcouniformation.png",
    name: "OPCO Cohésion sociale",
    simulatorUrl: "https://www.uniformation.fr/entreprise/recrutement-en-alternance/simulateur-de-contrat-alternance",
  },
  "OPCO Construction": { logo: "opcoconstructys.png", name: "OPCO Construction", url: "https://www.constructys.fr/" },
};

export const idccOpcos: OpcoIdcc[] = [
  {
    idcc: "3",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "16",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "18",
    opco: "OPCO 2i",
  },
  {
    idcc: "29",
    opco: "OPCO Santé",
  },
  {
    idcc: "43",
    opco: "OPCO Commerce",
  },
  {
    idcc: "44",
    opco: "OPCO 2i",
  },
  {
    idcc: "45",
    opco: "OPCO 2i",
  },
  {
    idcc: "83",
    opco: "OPCO 2i",
  },
  {
    idcc: "86",
    opco: "AFDAS",
  },
  {
    idcc: "87",
    opco: "OPCO 2i",
  },
  {
    idcc: "112",
    opco: "OCAPIAT",
  },
  {
    idcc: "135",
    opco: "OPCO 2i",
  },
  {
    idcc: "158",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "176",
    opco: "OPCO 2i",
  },
  {
    idcc: "184",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "200",
    opco: "OCAPIAT",
  },
  {
    idcc: "207",
    opco: "OPCO 2i",
  },
  {
    idcc: "211",
    opco: "OPCO 2i",
  },
  {
    idcc: "214",
    opco: "AFDAS",
  },
  {
    idcc: "218",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "240",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "247",
    opco: "OPCO 2i",
  },
  {
    idcc: "275",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "292",
    opco: "OPCO 2i",
  },
  {
    idcc: "303",
    opco: "OPCO 2i",
  },
  {
    idcc: "306",
    opco: "AFDAS",
  },
  {
    idcc: "363",
    opco: "OPCO 2i",
  },
  {
    idcc: "394",
    opco: "AFDAS",
  },
  {
    idcc: "405",
    opco: "OPCO Santé",
  },
  {
    idcc: "412",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "413",
    opco: "OPCO Santé",
  },
  {
    idcc: "438",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "454",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "468",
    opco: "OPCO Commerce",
  },
  {
    idcc: "478",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "489",
    opco: "OPCO 2i",
  },
  {
    idcc: "493",
    opco: "OCAPIAT",
  },
  {
    idcc: "500",
    opco: "OPCO Commerce",
  },
  {
    idcc: "509",
    opco: "AFDAS",
  },
  {
    idcc: "538",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "567",
    opco: "OPCO 2i",
  },
  {
    idcc: "573",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "598",
    opco: "AFDAS",
  },
  {
    idcc: "614",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "635",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "637",
    opco: "OPCO 2i",
  },
  {
    idcc: "653",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "669",
    opco: "OPCO 2i",
  },
  {
    idcc: "675",
    opco: "OPCO Commerce",
  },
  {
    idcc: "693",
    opco: "AFDAS",
  },
  {
    idcc: "698",
    opco: "AFDAS",
  },
  {
    idcc: "700",
    opco: "OPCO 2i",
  },
  {
    idcc: "706",
    opco: "OPCO Commerce",
  },
  {
    idcc: "707",
    opco: "OPCO 2i",
  },
  {
    idcc: "715",
    opco: "OPCO 2i",
  },
  {
    idcc: "716",
    opco: "AFDAS",
  },
  {
    idcc: "731",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "733",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "759",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "779",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "781",
    opco: "AFDAS",
  },
  {
    idcc: "783",
    opco: "OPCO Santé",
  },
  {
    idcc: "787",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "802",
    opco: "OPCO 2i",
  },
  {
    idcc: "832",
    opco: "OPCO 2i",
  },
  {
    idcc: "833",
    opco: "OPCO 2i",
  },
  {
    idcc: "843",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "892",
    opco: "AFDAS",
  },
  {
    idcc: "897",
    opco: "OPCO Santé",
  },
  {
    idcc: "915",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "925",
    opco: "OPCO 2i",
  },
  {
    idcc: "953",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "959",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "992",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "993",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "998",
    opco: "OPCO 2i",
  },
  {
    idcc: "1000",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1001",
    opco: "OPCO Santé",
  },
  {
    idcc: "1016",
    opco: "AFDAS",
  },
  {
    idcc: "1018",
    opco: "AFDAS",
  },
  {
    idcc: "1031",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1043",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1044",
    opco: "OPCO 2i",
  },
  {
    idcc: "1077",
    opco: "OCAPIAT",
  },
  {
    idcc: "1083",
    opco: "AFDAS",
  },
  {
    idcc: "1090",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1147",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1170",
    opco: "OPCO 2i",
  },
  {
    idcc: "1182",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1194",
    opco: "AFDAS",
  },
  {
    idcc: "1256",
    opco: "OPCO 2i",
  },
  {
    idcc: "1261",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1266",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1267",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1278",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1281",
    opco: "AFDAS",
  },
  {
    idcc: "1285",
    opco: "AFDAS",
  },
  {
    idcc: "1286",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1307",
    opco: "AFDAS",
  },
  {
    idcc: "1311",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1314",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1316",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1351",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1383",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1388",
    opco: "OPCO 2i",
  },
  {
    idcc: "1391",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1396",
    opco: "OCAPIAT",
  },
  {
    idcc: "1404",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1405",
    opco: "OCAPIAT",
  },
  {
    idcc: "1408",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1411",
    opco: "OPCO 2i",
  },
  {
    idcc: "1412",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1413",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1420",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1423",
    opco: "OPCO 2i",
  },
  {
    idcc: "1424",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1431",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1468",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "1480",
    opco: "AFDAS",
  },
  {
    idcc: "1483",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1486",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "1487",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1492",
    opco: "OPCO 2i",
  },
  {
    idcc: "1495",
    opco: "OPCO 2i",
  },
  {
    idcc: "1499",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1501",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1504",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1505",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1512",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1513",
    opco: "OCAPIAT",
  },
  {
    idcc: "1516",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1517",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1518",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1527",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1534",
    opco: "OCAPIAT",
  },
  {
    idcc: "1536",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1539",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1555",
    opco: "OPCO 2i",
  },
  {
    idcc: "1557",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1558",
    opco: "OPCO 2i",
  },
  {
    idcc: "1563",
    opco: "AFDAS",
  },
  {
    idcc: "1580",
    opco: "OPCO 2i",
  },
  {
    idcc: "1586",
    opco: "OCAPIAT",
  },
  {
    idcc: "1588",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1589",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1596",
    opco: "OPCO Construction",
  },
  {
    idcc: "1597",
    opco: "OPCO Construction",
  },
  {
    idcc: "1605",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1606",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1607",
    opco: "OPCO 2i",
  },
  {
    idcc: "1611",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1618",
    opco: "AFDAS",
  },
  {
    idcc: "1619",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1621",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1631",
    opco: "AFDAS",
  },
  {
    idcc: "1659",
    opco: "OCAPIAT",
  },
  {
    idcc: "1671",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1672",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "1679",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "1686",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1702",
    opco: "OPCO Construction",
  },
  {
    idcc: "1710",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1734",
    opco: "AFDAS",
  },
  {
    idcc: "1747",
    opco: "OCAPIAT",
  },
  {
    idcc: "1760",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1790",
    opco: "AFDAS",
  },
  {
    idcc: "1794",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "1801",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "1821",
    opco: "OPCO 2i",
  },
  {
    idcc: "1850",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1874",
    opco: "AFDAS",
  },
  {
    idcc: "1875",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1880",
    opco: "OPCO Commerce",
  },
  {
    idcc: "1895",
    opco: "AFDAS",
  },
  {
    idcc: "1909",
    opco: "AFDAS",
  },
  {
    idcc: "1921",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1922",
    opco: "AFDAS",
  },
  {
    idcc: "1930",
    opco: "OCAPIAT",
  },
  {
    idcc: "1938",
    opco: "OCAPIAT",
  },
  {
    idcc: "1944",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1947",
    opco: "OPCO Construction",
  },
  {
    idcc: "1951",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1974",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "1978",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1979",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "1982",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "1987",
    opco: "OCAPIAT",
  },
  {
    idcc: "1996",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2002",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2021",
    opco: "AFDAS",
  },
  {
    idcc: "2046",
    opco: "OPCO Santé",
  },
  {
    idcc: "2060",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2075",
    opco: "OCAPIAT",
  },
  {
    idcc: "2089",
    opco: "OPCO 2i",
  },
  {
    idcc: "2098",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2101",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2104",
    opco: "OPCO Santé",
  },
  {
    idcc: "2111",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2120",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2121",
    opco: "AFDAS",
  },
  {
    idcc: "2128",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2147",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2148",
    opco: "AFDAS",
  },
  {
    idcc: "2149",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2150",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2156",
    opco: "OPCO Commerce",
  },
  {
    idcc: "2174",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "2190",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2198",
    opco: "OPCO Commerce",
  },
  {
    idcc: "2205",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2216",
    opco: "OPCO Commerce",
  },
  {
    idcc: "2219",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2230",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2247",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2257",
    opco: "AFDAS",
  },
  {
    idcc: "2264",
    opco: "OPCO Santé",
  },
  {
    idcc: "2272",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2329",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2332",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2335",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2336",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2357",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2372",
    opco: "AFDAS",
  },
  {
    idcc: "2378",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2395",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2397",
    opco: "AFDAS",
  },
  {
    idcc: "2408",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2411",
    opco: "AFDAS",
  },
  {
    idcc: "2412",
    opco: "AFDAS",
  },
  {
    idcc: "2420",
    opco: "OPCO Construction",
  },
  {
    idcc: "2494",
    opco: "OCAPIAT",
  },
  {
    idcc: "2511",
    opco: "AFDAS",
  },
  {
    idcc: "2526",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2528",
    opco: "OPCO 2i",
  },
  {
    idcc: "2543",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2564",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2583",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2596",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2603",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2609",
    opco: "OPCO Construction",
  },
  {
    idcc: "2614",
    opco: "OPCO Construction",
  },
  {
    idcc: "2622",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2642",
    opco: "AFDAS",
  },
  {
    idcc: "2666",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2668",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2683",
    opco: "AFDAS",
  },
  {
    idcc: "2691",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "2697",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2706",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2717",
    opco: "AFDAS",
  },
  {
    idcc: "2727",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2728",
    opco: "OCAPIAT",
  },
  {
    idcc: "2768",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2770",
    opco: "AFDAS",
  },
  {
    idcc: "2785",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "2793",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2796",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2797",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2798",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2847",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2931",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "2941",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "2972",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "2978",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "3013",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "3016",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "3017",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "3032",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "3043",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "3090",
    opco: "AFDAS",
  },
  {
    idcc: "3097",
    opco: "AFDAS",
  },
  {
    idcc: "3105",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "3109",
    opco: "OCAPIAT",
  },
  {
    idcc: "3127",
    opco: "OPCO entreprises de proximité",
  },
  {
    idcc: "3168",
    opco: "OPCO Commerce",
  },
  {
    idcc: "3203",
    opco: "OCAPIAT",
  },
  {
    idcc: "3205",
    opco: "OPCO Commerce",
  },
  {
    idcc: "3210",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "3212",
    opco: "OPCO Construction",
  },
  {
    idcc: "3213",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "3216",
    opco: "OPCO Construction",
  },
  {
    idcc: "3217",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "3218",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "3219",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "3220",
    opco: "OPCO Cohésion sociale",
  },
  {
    idcc: "3221",
    opco: "AFDAS",
  },
  {
    idcc: "3223",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "3224",
    opco: "OPCO 2i",
  },
  {
    idcc: "3225",
    opco: "AFDAS",
  },
  {
    idcc: "3227",
    opco: "OPCO 2i",
  },
  {
    idcc: "3228",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "3230",
    opco: "AFDAS",
  },
  {
    idcc: "5001",
    opco: "OPCO 2i",
  },
  {
    idcc: "5005",
    opco: "OPCO ATLAS",
  },
  {
    idcc: "5521",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "5554",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "5555",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "5556",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "5557",
    opco: "OPCO Mobilité",
  },
  {
    idcc: "5619",
    opco: "OCAPIAT",
  },
  {
    idcc: "7001",
    opco: "OCAPIAT",
  },
  {
    idcc: "7002",
    opco: "OCAPIAT",
  },
  {
    idcc: "7003",
    opco: "OCAPIAT",
  },
  {
    idcc: "7004",
    opco: "OCAPIAT",
  },
  {
    idcc: "7005",
    opco: "OCAPIAT",
  },
  {
    idcc: "7006",
    opco: "OCAPIAT",
  },
  {
    idcc: "7007",
    opco: "OCAPIAT",
  },
  {
    idcc: "7008",
    opco: "OCAPIAT",
  },
  {
    idcc: "7009",
    opco: "OCAPIAT",
  },
  {
    idcc: "7010",
    opco: "OCAPIAT",
  },
  {
    idcc: "7012",
    opco: "OCAPIAT",
  },
  {
    idcc: "7013",
    opco: "OCAPIAT",
  },
  {
    idcc: "7014",
    opco: "OCAPIAT",
  },
  {
    idcc: "7017",
    opco: "OCAPIAT",
  },
  {
    idcc: "7018",
    opco: "OCAPIAT",
  },
  {
    idcc: "7019",
    opco: "OCAPIAT",
  },
  {
    idcc: "7020",
    opco: "OCAPIAT",
  },
  {
    idcc: "7021",
    opco: "OCAPIAT",
  },
  {
    idcc: "7023",
    opco: "OCAPIAT",
  },
  {
    idcc: "7501",
    opco: "OCAPIAT",
  },
  {
    idcc: "7502",
    opco: "OCAPIAT",
  },
  {
    idcc: "7503",
    opco: "OCAPIAT",
  },
  {
    idcc: "7508",
    opco: "OCAPIAT",
  },
  {
    idcc: "7509",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "7513",
    opco: "OCAPIAT",
  },
  {
    idcc: "7514",
    opco: "OCAPIAT",
  },
  {
    idcc: "7515",
    opco: "OCAPIAT",
  },
  {
    idcc: "7520",
    opco: "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
  },
  {
    idcc: "8115",
    opco: "OCAPIAT",
  },
  {
    idcc: "8435",
    opco: "OCAPIAT",
  },
];

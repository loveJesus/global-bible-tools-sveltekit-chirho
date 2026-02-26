// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Registry of all interlinear Bible PDFs hosted on R2 CDN.
 * Keyed by language code. Used by the read page and downloads page.
 *
 * To add a new PDF: add an entry here and on the downloads page.
 */

const R2_BASE_CHIRHO = 'https://media-global-tools.bible.systems/bibles-chirho';

export interface InterlinearPdfChirho {
	codeChirho: string;
	nameChirho: string;
	hasPdfChirho: boolean;
	pdfPathChirho: string;
	badgeChirho?: string;
}

export const INTERLINEAR_PDFS_CHIRHO: Record<string, InterlinearPdfChirho[]> = {
	eng: [
		{
			codeChirho: 'kjv',
			nameChirho: 'King James Version',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-eng-kjv-chirho.pdf`
		},
		{
			codeChirho: 'web',
			nameChirho: 'World English Bible',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-eng-web-chirho.pdf`
		},
		{
			codeChirho: 'kjv-readers',
			nameChirho: 'King James Version',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-eng-kjv-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	spa: [
		{
			codeChirho: 'rv1909',
			nameChirho: 'Reina-Valera 1909',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-spa-rv1909-chirho.pdf`
		}
	],
	por: [
		{
			codeChirho: 'almeida1911',
			nameChirho: 'Almeida 1911',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-por-almeida1911-chirho.pdf`
		}
	],
	hin: [
		{
			codeChirho: 'hinerv',
			nameChirho: 'Hindi ERV',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-hin-hinerv-chirho.pdf`
		},
		{
			codeChirho: 'hinfbi-large',
			nameChirho: 'Hindi FBI',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-hin-large-hinfbi-chirho.pdf`,
			badgeChirho: 'Large Font'
		},
		{
			codeChirho: 'hinerv-readers',
			nameChirho: 'Hindi ERV',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-hinerv-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		},
		{
			codeChirho: 'hinfbi-readers',
			nameChirho: 'Hindi FBI',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-hinfbi-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	ben: [
		{
			codeChirho: 'ben2006eb',
			nameChirho: 'Bengali 2006EB',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-ben-ben2006eb-chirho.pdf`
		},
		{
			codeChirho: 'ben2006eb-readers',
			nameChirho: 'Bengali 2006EB',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-ben-ben2006eb-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	urd: [
		{
			codeChirho: 'urdugeo',
			nameChirho: 'Urdu Geo',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-urd-urdugeo-chirho.pdf`,
			badgeChirho: 'Large Font'
		}
	],
	ind: [
		{
			codeChirho: 'indtb',
			nameChirho: 'Terjemahan Baru',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-ind-indtb-chirho.pdf`
		}
	],
	jav: [
		{
			codeChirho: 'javsabda',
			nameChirho: 'SABDA',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-jav-javsabda-chirho.pdf`
		}
	],
	rus: [
		{
			codeChirho: 'synodal',
			nameChirho: 'Synodal',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-rus-synodal-chirho.pdf`
		}
	],
	tur: [
		{
			codeChirho: 'turhadi',
			nameChirho: 'HADI',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-tur-turhadi-chirho.pdf`
		}
	],
	swa: [
		{
			codeChirho: 'swhulb',
			nameChirho: 'Swahili ULB',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-swa-swhulb-chirho.pdf`
		}
	],
	arb: [
		{
			codeChirho: 'arasvd',
			nameChirho: 'Smith Van Dyke',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-arb-arasvd-chirho.pdf`
		}
	],
	kor: [
		{
			codeChirho: 'korrv',
			nameChirho: 'Korean Revised',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-kor-korrv-chirho.pdf`
		}
	],
	deu: [
		{
			codeChirho: 'gerelb1905',
			nameChirho: 'Elberfelder 1905',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-deu-gerelb1905-chirho.pdf`
		}
	],
	fra: [
		{
			codeChirho: 'frejnd',
			nameChirho: 'Darby (FreJND)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-fra-frejnd-chirho.pdf`
		}
	],
	ita: [
		{
			codeChirho: 'itarive',
			nameChirho: 'Riveduta 1927',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-ita-itarive-chirho.pdf`
		}
	],
	heb: [
		{
			codeChirho: 'hebmodern',
			nameChirho: 'Modern Hebrew',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-heb-hebmodern-chirho.pdf`
		}
	],
	mya: [
		{
			codeChirho: 'burjudson',
			nameChirho: 'Judson (1835)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-mya-burjudson-chirho.pdf`
		}
	],
	tam: [
		{
			codeChirho: 'tamirv',
			nameChirho: 'Tamil IRV',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-tam-tamirv-chirho.pdf`
		}
	],
	zho: [
		{
			codeChirho: 'chiuns',
			nameChirho: 'Chinese Union (CUV)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-zho-chiuns-chirho.pdf`
		}
	],
	amh: [
		{
			codeChirho: 'amhselassie',
			nameChirho: 'Amharic Selassie Bible',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-amh-amhselassie-chirho.pdf`
		}
	],
	vie: [
		{
			codeChirho: 'vie1934-readers',
			nameChirho: 'Vietnamese (1934)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-vie-vie1934-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	nep: [
		{
			codeChirho: 'nep-erv-readers',
			nameChirho: 'Nepali ERV',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-nep-nep-erv-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	ukr: [
		{
			codeChirho: 'ukrogienko-readers',
			nameChirho: 'Ogienko (1962)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-ukr-ukrogienko-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	jpn: [
		{
			codeChirho: 'japkougo-readers',
			nameChirho: 'Kougo-yaku (1955)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-jpn-japkougo-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	srp: [
		{
			codeChirho: 'srpdk-readers',
			nameChirho: 'Daničić-Karadžić (1868)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-srp-srpdk-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	guj: [
		{
			codeChirho: 'gujirv-readers',
			nameChirho: 'Gujarati IRV (2019)',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-guj-gujirv-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	],
	tha: [
		{
			codeChirho: 'tha-readers',
			nameChirho: 'Thai KJV Readers Edition',
			hasPdfChirho: true,
			pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-tha-chirho.pdf`,
			badgeChirho: 'Readers Edition'
		}
	]
};

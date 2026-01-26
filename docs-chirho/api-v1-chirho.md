# Global Bible Tools REST API v1

Base URL: `https://global-tools.bible.systems/api-chirho/v1-chirho`

## Authentication

All endpoints require an API key. Pass it via either header:

```
Authorization: Bearer <api-key>
X-API-Key: <api-key>
```

## Endpoints

### GET /api-chirho/v1-chirho

Returns API documentation and available endpoints.

**Authentication:** Not required

**Response:**
```json
{
  "name_chirho": "Global Bible Tools API",
  "version_chirho": "v1",
  "endpoints_chirho": [...]
}
```

---

### GET /api-chirho/v1-chirho/books-chirho

List all 66 Bible books with verse and chapter counts.

**Example:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  https://global-tools.bible.systems/api-chirho/v1-chirho/books-chirho
```

**Response:**
```json
{
  "books_chirho": [
    {
      "id_chirho": 1,
      "name_chirho": "Genesis",
      "verse_count_chirho": 1533,
      "chapter_count_chirho": 50
    },
    {
      "id_chirho": 2,
      "name_chirho": "Exodus",
      "verse_count_chirho": 1213,
      "chapter_count_chirho": 40
    }
  ]
}
```

---

### GET /api-chirho/v1-chirho/languages-chirho

List available translation languages with gloss counts.

**Example:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  https://global-tools.bible.systems/api-chirho/v1-chirho/languages-chirho
```

**Response:**
```json
{
  "languages_chirho": [
    {
      "id_chirho": "019bd977-f66c-caaa-c3d2-06891d632321",
      "code_chirho": "hin",
      "name_chirho": "Hindi",
      "font_chirho": "Noto Sans Devanagari",
      "text_direction_chirho": "ltr",
      "gloss_count_chirho": 448269
    },
    {
      "id_chirho": "...",
      "code_chirho": "spa",
      "name_chirho": "Spanish",
      "font_chirho": "Noto Sans",
      "text_direction_chirho": "ltr",
      "gloss_count_chirho": 448269
    }
  ]
}
```

---

### GET /api-chirho/v1-chirho/verses-chirho/:book/:chapter

Get source text (Greek/Hebrew) words for a chapter.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `book` | string/int | Book name ("Genesis", "John") or ID (1-66) |
| `chapter` | int | Chapter number |

**Example:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  https://global-tools.bible.systems/api-chirho/v1-chirho/verses-chirho/john/3
```

**Response:**
```json
{
  "book_chirho": "john",
  "chapter_chirho": 3,
  "verses_chirho": [
    {
      "verse_chirho": 1,
      "words_chirho": [
        {
          "id_chirho": "43003001001",
          "text_chirho": "Ἦν",
          "lemma_id_chirho": "G1510",
          "grammar_chirho": "V-IAI-3S"
        },
        {
          "id_chirho": "43003001002",
          "text_chirho": "δὲ",
          "lemma_id_chirho": "G1161",
          "grammar_chirho": "CONJ"
        }
      ]
    }
  ]
}
```

---

### GET /api-chirho/v1-chirho/glosses-chirho/:language/:book/:chapter

Get word-by-word translations (glosses) for a chapter in a specific language.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `language` | string | Language code ("spa", "hin", "ben") |
| `book` | string/int | Book name or ID |
| `chapter` | int | Chapter number |

**Example:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/spa/john/3
```

**Response:**
```json
{
  "language_chirho": "spa",
  "book_chirho": "john",
  "chapter_chirho": 3,
  "coverage_chirho": {
    "total_words_chirho": 507,
    "glossed_words_chirho": 507,
    "percentage_chirho": 100
  },
  "verses_chirho": [
    {
      "verse_chirho": 1,
      "words_chirho": [
        {
          "id_chirho": "43003001001",
          "source_chirho": "Ἦν",
          "lemma_id_chirho": "G1510",
          "gloss_chirho": "Había",
          "state_chirho": "approved"
        },
        {
          "id_chirho": "43003001002",
          "source_chirho": "δὲ",
          "lemma_id_chirho": "G1161",
          "gloss_chirho": "–y",
          "state_chirho": "approved"
        }
      ]
    }
  ]
}
```

---

## Available Languages (43 total)

### Complete Translations (100%)
| Code | Language | Glosses |
|------|----------|---------|
| `eng` | English | 448,269 |
| `spa` | Spanish | 448,256 |
| `hin` | Hindi | 442,321 |

### Partial Translations
| Code | Language | Glosses | Coverage |
|------|----------|---------|----------|
| `ben` | Bengali | 153,654 | ~34% |
| `rus` | Russian | 86,016 | ~19% |
| `swa` | Swahili | 66,259 | ~15% |
| `tur` | Turkish | 60,260 | ~13% |

### Starter Translations (~754 glosses each)
| Code | Language | Code | Language |
|------|----------|------|----------|
| `amh` | Amharic | `mar` | Marathi |
| `arb` | Arabic | `mya` | Burmese |
| `ces` | Czech | `nld` | Dutch |
| `dan` | Danish | `nor` | Norwegian |
| `deu` | German | `pnb` | Western Punjabi |
| `ell` | Modern Greek | `pol` | Polish |
| `fra` | French | `por` | Portuguese |
| `guj` | Gujarati | `ron` | Romanian |
| `hat` | Haitian Creole | `swe` | Swedish |
| `hau` | Hausa | `tam` | Tamil |
| `heb` | Modern Hebrew | `tel` | Telugu |
| `hun` | Hungarian | `tgl` | Tagalog |
| `ind` | Indonesian | `tha` | Thai |
| `ita` | Italian | `ukr` | Ukrainian |
| `jav` | Javanese | `urd` | Urdu |
| `jpn` | Japanese | `vie` | Vietnamese |
| `kor` | Korean | `yor` | Yoruba |
| `yue` | Cantonese | `zho` | Chinese (Simplified) |

---

## Book Reference

Books can be specified by ID (1-66), full name, or abbreviation.

### Old Testament (1-39)
| ID | Name | Aliases |
|----|------|---------|
| 1 | Genesis | gen, gn |
| 2 | Exodus | exo, ex |
| 3 | Leviticus | lev, lv |
| 4 | Numbers | num, nm |
| 5 | Deuteronomy | deu, deut, dt |
| 6 | Joshua | jos, josh |
| 7 | Judges | jdg, judg |
| 8 | Ruth | rut, ru |
| 9 | 1 Samuel | 1sam, 1sm |
| 10 | 2 Samuel | 2sam, 2sm |
| 11 | 1 Kings | 1kgs, 1ki |
| 12 | 2 Kings | 2kgs, 2ki |
| 13 | 1 Chronicles | 1chr, 1ch |
| 14 | 2 Chronicles | 2chr, 2ch |
| 15 | Ezra | ezr |
| 16 | Nehemiah | neh, ne |
| 17 | Esther | est, esth |
| 18 | Job | jb |
| 19 | Psalms | psa, ps, psalm |
| 20 | Proverbs | pro, prov, pr |
| 21 | Ecclesiastes | ecc, eccl, ec |
| 22 | Song of Solomon | sos, song, sng |
| 23 | Isaiah | isa, is |
| 24 | Jeremiah | jer, je |
| 25 | Lamentations | lam, la |
| 26 | Ezekiel | eze, ezek |
| 27 | Daniel | dan, da |
| 28 | Hosea | hos, ho |
| 29 | Joel | jol, jl |
| 30 | Amos | amo, am |
| 31 | Obadiah | oba, ob |
| 32 | Jonah | jon, jnh |
| 33 | Micah | mic, mi |
| 34 | Nahum | nah, na |
| 35 | Habakkuk | hab, hb |
| 36 | Zephaniah | zep, zph |
| 37 | Haggai | hag, hg |
| 38 | Zechariah | zec, zech |
| 39 | Malachi | mal, ml |

### New Testament (40-66)
| ID | Name | Aliases |
|----|------|---------|
| 40 | Matthew | mat, matt, mt |
| 41 | Mark | mrk, mk, mar |
| 42 | Luke | luk, lk |
| 43 | John | jhn, jn |
| 44 | Acts | act, ac |
| 45 | Romans | rom, ro |
| 46 | 1 Corinthians | 1cor, 1co |
| 47 | 2 Corinthians | 2cor, 2co |
| 48 | Galatians | gal, ga |
| 49 | Ephesians | eph |
| 50 | Philippians | php, phil |
| 51 | Colossians | col |
| 52 | 1 Thessalonians | 1thess, 1th |
| 53 | 2 Thessalonians | 2thess, 2th |
| 54 | 1 Timothy | 1tim, 1ti |
| 55 | 2 Timothy | 2tim, 2ti |
| 56 | Titus | tit, ti |
| 57 | Philemon | phm, phlm |
| 58 | Hebrews | heb |
| 59 | James | jas, jam, jm |
| 60 | 1 Peter | 1pet, 1pe, 1pt |
| 61 | 2 Peter | 2pet, 2pe, 2pt |
| 62 | 1 John | 1jn, 1jo |
| 63 | 2 John | 2jn, 2jo |
| 64 | 3 John | 3jn, 3jo |
| 65 | Jude | jud, jd |
| 66 | Revelation | rev, re, apocalypse |

---

## Error Responses

| Status | Description |
|--------|-------------|
| 401 | API key missing |
| 403 | Invalid API key |
| 404 | Resource not found (book, chapter, language) |
| 500 | Server error |

**Error format:**
```json
{
  "error_chirho": "Description of the error"
}
```

---

## Rate Limits

- Responses are cached for 5 minutes
- No hard rate limits currently enforced

---

## Word ID Format

Word IDs follow the format: `BBCCCVVVWWW`
- `BB` = Book ID (01-66)
- `CCC` = Chapter (001-150)
- `VVV` = Verse (001-176)
- `WWW` = Word position (001-999)

Example: `43003016001` = John (43) 3:16 word 1

---

## Strong's Numbers

Lemma IDs use Strong's numbering:
- `H####` = Hebrew (Old Testament)
- `G####` = Greek (New Testament)

Link to BibleHub: `https://biblehub.com/hebrew/####.htm` or `https://biblehub.com/greek/####.htm`

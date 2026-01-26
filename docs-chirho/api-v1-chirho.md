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

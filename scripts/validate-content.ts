import * as fs from 'fs';
import * as path from 'path';

// Helper to count words in a string
function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Tokenize text for Jaccard similarity comparison
function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '') // remove punctuation
    .split(/\s+/)
    .filter(w => w.length > 2); // only words > 2 chars
  return new Set(words);
}

// Jaccard similarity index
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

function getJsonFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsonFiles(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Main execution block
function validate() {
  console.log('--- CONTENT LINTER STARTING ---');
  const targetDir = path.resolve(process.cwd(), 'src/data/calculators');
  
  if (!fs.existsSync(targetDir)) {
    console.error(`Error: Data directory ${targetDir} does not exist.`);
    process.exit(1);
  }

  const files = getJsonFiles(targetDir);
  console.log(`Found ${files.length} calculator configurations to validate.\n`);

  let errors = 0;
  const pageContents: Array<{ file: string; lang: string; category: string; tokens: Set<string>; text: string }> = [];

  files.forEach(filePath => {
    const fileBase = path.basename(filePath);
    const contentRaw = fs.readFileSync(filePath, 'utf8');
    
    let data: any;
    try {
      data = JSON.parse(contentRaw);
    } catch (e) {
      console.error(`[ERROR] [JSON Parse] ${fileBase} contains invalid JSON.`);
      errors++;
      return;
    }

    // Required root fields
    const requiredRoot = ['slug', 'category', 'status', 'formulaId', 'translations'];
    requiredRoot.forEach(field => {
      if (!data[field]) {
        console.error(`[ERROR] [Root Schema] ${fileBase} is missing root property: "${field}"`);
        errors++;
      }
    });

    if (!data.translations) return;

    // Validate locales
    ['en', 'fr'].forEach(lang => {
      const trans = data.translations[lang];
      if (!trans) {
        console.error(`[ERROR] [i18n] ${fileBase} is missing locale: "${lang}"`);
        errors++;
        return;
      }

      // Check title, metaDescription, intro, methodology, faq
      const fields = ['title', 'slug', 'metaDescription', 'intro', 'methodology', 'faq'];
      fields.forEach(field => {
        if (!trans[field]) {
          console.error(`[ERROR] [Field Missing] ${fileBase} [${lang}] is missing: "${field}"`);
          errors++;
        }
      });

      // Word count validation (Rule CONT-1: intro >= 150 words)
      if (trans.intro) {
        const words = countWords(trans.intro);
        if (words < 150) {
          console.error(`[ERROR] [Thin Content] ${fileBase} [${lang}] intro has only ${words} words (Required: >= 150 words).`);
          errors++;
        }
      }

      // FAQ size validation (Rule CONT-1: FAQ count >= 3)
      if (trans.faq) {
        if (!Array.isArray(trans.faq) || trans.faq.length < 3) {
          console.error(`[ERROR] [Thin Content] ${fileBase} [${lang}] faq block has ${trans.faq?.length || 0} entries (Required: >= 3).`);
          errors++;
        }
      }

      // Collect text tokens for Jaccard similarity indexing
      if (trans.intro) {
        const combinedText = `${trans.title} ${trans.intro} ${trans.metaDescription} ${trans.methodology || ''}`;
        pageContents.push({
          file: fileBase,
          lang,
          category: data.category || 'neutral',
          tokens: tokenize(combinedText),
          text: combinedText
        });
      }
    });
  });

  // Cross-uniqueness checking (Rule CONT-3: similarity threshold < 70% between sibling categories)
  for (let i = 0; i < pageContents.length; i++) {
    for (let j = i + 1; j < pageContents.length; j++) {
      const pageA = pageContents[i];
      const pageB = pageContents[j];
      
      // Compare pages in same language and category
      if (pageA.lang === pageB.lang && pageA.category === pageB.category) {
        const sim = calculateJaccardSimilarity(pageA.tokens, pageB.tokens);
        if (sim > 0.70) {
          console.error(`[ERROR] [Duplicate Content] High text similarity (${(sim * 100).toFixed(1)}%) found between:`);
          console.error(`  - ${pageA.file} [${pageA.lang}]`);
          console.error(`  - ${pageB.file} [${pageB.lang}]`);
          errors++;
        }
      }
    }
  }

  console.log('\n--- LINTER REPORT SUMMARY ---');
  if (errors > 0) {
    console.error(`Linter failed with ${errors} validation errors. Fix them before building.`);
    process.exit(1);
  } else {
    console.log('All validations passed successfully! Output is compliant with SEO & Content rules.');
  }
}

validate();

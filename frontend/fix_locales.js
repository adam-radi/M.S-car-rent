const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const pagesDir = path.join(__dirname, 'src/pages');
const localesDir = path.join(__dirname, 'src/locales');

const extractKeys = () => {
    let keys = new Set();
    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
    files.forEach(file => {
        const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        const matches = content.match(/t\(['"](admin\.[^'"]+)['"]\)/g);
        if (matches) {
            matches.forEach(m => {
                const key = m.match(/t\(['"](.*)['"]\)/)[1];
                keys.add(key);
            });
        }
    });
    return Array.from(keys);
};

const keys = extractKeys();
const unflatten = (data) => {
    let result = {};
    for (let i in data) {
        let keys = i.split('.');
        keys.reduce((r, e, j) => {
            return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? data[i] : {}) : []);
        }, result);
    }
    return result;
};

const flatKeys = {};
keys.forEach(k => {
    flatKeys[k] = k.split('.').pop().replace(/([A-Z])/g, ' ').replace(/^./, str => str.toUpperCase());
});

const newObj = unflatten(flatKeys);

locales.forEach(lang => {
    const file = path.join(localesDir, lang + '.json');
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    // Deep merge function
    const merge = (target, source) => {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], merge(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    };
    
    merge(existing, newObj);
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
    console.log('Updated ' + lang + '.json');
});

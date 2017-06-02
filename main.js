const Path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const Through = require('through2');


const importTemplate = function(source, filePath) {
    let matches = null;
    let findImports = /<template[^>]*( src="([^"]+)")[^>]*><\/template>/g;
    let htmlTarget = source;

    while ((matches = findImports.exec(source))) {
        let [template, src, path] = matches;
        let newTemplate = template.replace(src, '');
        let templateContent = null;

        // reslove path
        path = Path.resolve(Path.parse(filePath).dir, path);

        try {
            // read template content
            templateContent = fs.readFileSync(path).toString('utf-8');
            templateContent = (new JSDOM(templateContent)).window.document.querySelector('template').innerHTML;

            // check of new imports in the loaded file
            templateContent = importTemplate(templateContent, path);

            // insert into current file
            newTemplate = newTemplate.replace(/></, `>${templateContent}<`);
            htmlTarget = htmlTarget.replace(template, newTemplate);
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`can't find template at ${e.path}!`);
            } else {
                throw e;
            }
        }
    }

    return htmlTarget;
};

module.exports = function() {
    return Through.obj(function(file, enc, cb) {
        let source = file.contents.toString('utf-8');

        source = importTemplate(source, file.path);

        file.contents = new Buffer(source);

        cb(null, file);
    });
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ;

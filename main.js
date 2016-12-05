const Path = require('path');
const fs = require('fs');
const jsdom = require('jsdom').jsdom;
const Through = require('through2');


const importTemplate = function(source, filePath) {
    let matches = null;
    let findImports = /<template[^>]*( src="([^"]+)")[^>]*><\/template>/g;

    while ((matches = findImports.exec(source))) {
        let [template, src, path] = matches;
        let newTemplate = template.replace(src, '');
        let templateContent = null;

        // reslove path
        path = Path.resolve(Path.parse(filePath).dir, path);

        try {
            // read template content
            templateContent = fs.readFileSync(path).toString('utf-8');

            templateContent = jsdom(templateContent).defaultView.document.querySelector('template').innerHTML;

            // check of new imports in the loaded file
            templateContent = importTemplate(templateContent, path);

            // insert into current file
            newTemplate = newTemplate.replace(/></, `>${templateContent}<`);
            source = source.replace(template, newTemplate);
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`can't find template at ${e.path}!`);
            } else {
                throw e;
            }
        }
    }

    return source;
};

module.exports = function() {
    return Through.obj(function(file, enc, cb) {
        let source = file.contents.toString('utf-8');

        source = importTemplate(source, file.path);

        file.contents = new Buffer(source);

        cb(null, file);
    });
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ;

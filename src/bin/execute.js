/**
 * This is readonly file
 */
const inquirer = require('inquirer');
const fs = require('fs');

const projectDir = process.cwd();
const srcDir = `${projectDir}/src/`;
const templateDir = `${srcDir}core/generator/templates/`;

const STEPS = [
  {
    name: 'model',
    type: 'input',
    message: 'Enter your model:',
    validate: function (input) {
      if (/^([A-Za-z])+$/.test(input)) {
        return true;
      } else {
        return 'Model name may only include letters.';
      }
    }
  }
];

inquirer.prompt(STEPS)
  .then((answers) => {
    const model = answers['model'];
    const modelName = kebabToUpperCamel(model);
    const targets = {
      model: {
        dir: `${srcDir}models`,
        fileName: `${modelName}.js`,
        name: modelName
      },
      controller: {
        dir: `${srcDir}controllers`,
        fileName: `${model}.controller.js`,
        name: modelName
      },
      route: {
        dir: `${srcDir}routes`,
        fileName: `${model}.routes.js`,
        name: model
      }
    };
    for (let key in targets) {
      createDirectoryContents(key, targets[key]);
    };
  }
);

kebabToUpperCamel = (string) => {
  string = string.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase(); 
  });
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
};

createDirectoryContents = (fileName, targetDirs) => {
  const origFilePath = `${templateDir}${fileName}.js`;
  const stats = fs.statSync(origFilePath);

  if (stats.isFile()) {
    let contents = fs.readFileSync(origFilePath, 'utf8');
    contents = contents.replace(/__MODEL__/g, targetDirs['name']);
    
    const writePath = `${targetDirs['dir']}/${targetDirs['fileName']}`;
    fs.writeFileSync(writePath, contents, 'utf8');
  } else if (stats.isDirectory()) {
    // fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
    // // recursive call
    // createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
  }
}

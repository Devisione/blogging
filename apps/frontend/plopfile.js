const segmentGenerator = (path) => [
  // config
  {
    key: "config",
    type: "add",
    path: `${path}/config/constants/index.ts`,
    templateFile: ".plop/templates/segment/config/constants/index.js.hbs",
  },
  // lib
  {
    key: "lib",
    type: "add",
    path: `${path}/lib/utils/index.ts`,
    templateFile: ".plop/templates/segment/lib/utils/index.js.hbs",
  },
  // model
  {
    key: "model",
    type: "add",
    path: `${path}/model/store/index.ts`,
    templateFile: ".plop/templates/segment/model/store/index.js.hbs",
  },
  {
    key: "model",
    type: "add",
    path: `${path}/model/types/index.ts`,
    templateFile: ".plop/templates/segment/model/types/index.js.hbs",
  },
  // ui
  {
    key: "ui",
    type: "add",
    path: `${path}/ui/index.tsx`,
    templateFile: ".plop/templates/segment/ui/index.js.hbs",
  },
  // api
  {
    key: "api",
    type: "add",
    path: `${path}/api/index.ts`,
    templateFile: ".plop/templates/segment/api/index.js.hbs",
  },
];

module.exports = (plop) => {
  plop.setGenerator("screens", {
    description: "Create a screen",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your screen name?",
      },
    ],
    actions: [
      // main page
      {
        type: "add",
        path: "src/screens/{{pascalCase name}}/index.tsx",
        templateFile: ".plop/templates/screen/index.js.hbs",
      },
      ...segmentGenerator("src/screens/{{pascalCase name}}").filter(
        ({ key }) => key !== "api",
      ),
    ],
  });
  plop.setGenerator("entities", {
    description: "Create a entities",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your entities name?",
      },
    ],
    actions: [...segmentGenerator("src/entities/{{pascalCase name}}")],
  });
  plop.setGenerator("page", {
    description: "Create a page",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your page name?",
      },
      {
        type: "input",
        name: "screen",
        message: "What is your screen use?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/pages/{{name}}/index.tsx",
        templateFile: ".plop/templates/pages/index.js.hbs",
      },
    ],
  });
  plop.setGenerator("features", {
    description: "Create a feature",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your feature name?",
      },
    ],
    actions: [
      // main page
      {
        type: "add",
        path: "src/features/{{pascalCase name}}/index.tsx",
        templateFile: ".plop/templates/feature/index.js.hbs",
      },
      ...segmentGenerator("src/features/{{pascalCase name}}").filter(
        ({ key }) => key !== "api",
      ),
    ],
  });
  plop.setGenerator("service", {
    description: "Create a service",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your service name?",
      },
    ],
    actions: [...segmentGenerator("src/services/{{pascalCase name}}")].filter(
      ({ key }) => key !== "ui" && key !== "api",
    ),
  });
  plop.setGenerator("api request", {
    description: "Create a service",
    prompts: [
      {
        type: "input",
        name: "entities_name",
        message: "What is your entities name?",
      },
      {
        type: "input",
        name: "api_name",
        message: "What is your api name name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: `src/entities/{{pascalCase entities_name}}/api/{{camelCase api_name}}/index.ts`,
        templateFile: ".plop/templates/api/index.js.hbs",
      },
      {
        type: "add",
        path: `src/entities/{{pascalCase entities_name}}/api/{{camelCase api_name}}/input.dto.ts`,
        templateFile: ".plop/templates/api/input.js.hbs",
      },
      {
        type: "add",
        path: `src/entities/{{pascalCase entities_name}}/api/{{camelCase api_name}}/output.dto.ts`,
        templateFile: ".plop/templates/api/output.js.hbs",
      },
      {
        type: "add",
        path: `src/entities/{{pascalCase entities_name}}/api/{{camelCase api_name}}/transform.ts`,
        templateFile: ".plop/templates/api/transform.js.hbs",
      },
    ],
  });
};

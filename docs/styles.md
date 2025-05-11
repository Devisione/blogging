[← Назад](../README.md)

## Стили

> Для стилизации компонентов используем метаязык [SCSS]('https://sass-scss.ru/').
> В качестве подхода организации SCSS кода используем [CSS Modules]('https://github.com/css-modules/css-modules')

### Правила написания стилей
1. Для стилизации компонентов создаем отдельный файл **{component-name}.module.scss** в папке компонента

   ```
   └──  ExampleUsageScss/
      ├── index.tsx
      ├── index.module.scss
      ├── mixins.module.scss
      └── variables.module.scss
   ```
2. Далее импортируем объект классов `classes` в компонент и присваиваем нужным элементам

### Пример стилизации компонента:

#### **`index.module.scss`**
```scss filename="index.module.scss"
@use "./mixins.module";

.actionIcon {
   padding: 20px;

   @include mixins.button-shadow;
}

.iconDark {
   color: var(--mantine-color-grape-0);
   background-color: var(--mantine-color-dark-5);
}

.iconLight {
   color: var(--mantine-color-dark-5);
   background-color: var(--mantine-color-grape-0);
}
```

#### **`mixins.module.scss`**
```scss filename="index.module.ts"
@use "./variables.module";

@mixin button-shadow {
   box-shadow: variables.$shadow-action-icon;
}
```

#### **`variables.module.scss`**
```scss filename="variables.module.scss"
$shadow-action-icon: 10px 10px 5px 0 rgba(0, 0, 0, 0.75);
```

#### **`index.tsx`**
```typescript jsx filename="index.tsx"
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun } from "@tabler/icons-react";
import { clsx } from "clsx";
import classes from "./index.module.scss";

export const ExampleUsageScss = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const actionIconStyle = clsx({
        [classes.iconDark]: colorScheme === "dark",
        [classes.iconLight]: colorScheme === "light",
    });

    return (
        <ActionIcon
            className={clsx(classes.actionIcon, actionIconStyle)}
            onClick={() => {
                toggleColorScheme();
            }}
            title="Toggle color scheme"
            variant="outline"
        >
            <IconSun size="14px" />
        </ActionIcon>
    );
};
```

> **Если stylelint не работает!**
>
> Убедитесь что в настройках **Webstorm** он включен, указан корректный путь до пакета и
> регулярное выражение файлов линтинга написано корректно.
> Если правильные настройки вам не помогли, обновите Webstorm до последней версии.

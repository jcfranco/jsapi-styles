# JSAPI Styles

This utility makes it easier to creating your own Sass theme for [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) applications.

By working with [Sass](http://sass-lang.com), you no longer need to figure out CSS overrides by brute-force, which is brittle and not scalable.

## Requirements

* [node/npm](https://nodejs.org/)
* Working knowledge of Sass is highly recommended

## Setup

Running `npm install` sets up the development environment, which will lay out the Sass theme files and launch a preview page that will automatically reload when making changes.

## Structure

The following is a simplified look at the styles folder structure:

```
sass/
  +-- base/
  |   +-- colors/
  |   +-- fonts/
  |   +-- icons/
  |   +-- images/
  |   +-- widgets/
  |
  +-- examples/
  |
  +-- my-theme/
      |
      +-- main.scss
```

* `base/` contains the foundation for all themes. Here is where we define variables, functions, mixins, and other helpers, such as color, font, and icon resources.

* `examples/` contains examples for different themes provided in the ArcGIS API for JavaScript.

* `my-theme/` contains your custom theme's main file.


## Customizing

Under `my-theme/` you will find `main.scss`. This file already imports the core for your theme, so the simplest way to start customizing is to to define variable overrides.

```scss
/*
  Theme: My Theme
*/

// variable overrides
$some_variable_to_override : <overridden value>;

// import theme base
@import "../base/core";
```

If you want more control, you can also create the theme to your liking and import any dependencies from `base` as needed.

```scss
@import "../base/mixins";  // mixins are now available for use

// custom scss goes here
```

By default `_core.scss` will include all widget styles. You can make the distributable theme leaner by excluding widget styles. Each widget has a corresponding variable that controls whether they are included in the theme or not. Set these to `false` for anything you want to exclude.

```scss
// exclude non-default widgets
$include_BasemapToggle    : false;
$include_ColorPicker      : false;
$include_HorizontalSlider : false;
$include_Legend           : false;
$include_RendererSlider   : false;
$include_Ripple           : false;
$include_Search           : false;
$include_Tags             : false;

// import theme base
@import "../base/core";
```

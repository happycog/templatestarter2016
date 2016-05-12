## Happy Cog starter files
 - Does not include Patternlab, can be ported over easily

### Coding Style

We follow Harry Robert's CSS Guidelines http://cssguidelin.es/

#### Typography

- Text styles should be defined via classes on elements in the HTML, classes like `.type-alpha--xxl`
- Text style classes should _never_ be extended with `@extend` in Sass, in general, please do not use `@extend`


#### Naming CSS Partials

- `config.` prefix denotes other files have dependencies on them
- `library.` prefix means file is basic, global styling and tooling
- `module.` is a small block of code that is indivisible
- `object.` is a collection of modules or a module and other elements

#### Breakpoints

- See `_config.mediaqueries.scss`
- We're using http://include-media.com/ to handle our media queries. Example usage is
```

@include media('>large') {

}
@include media('>=large') {

}
@include media('<large') {

}

```


#### Spacing

- See `library.spacing.scss`
- We're using the lobotomized owl technique for vertical spacing, meaning you should rarely is ever have to add margin-top/margin-bottom on elements for spacing. Instead, please add a class of `.spacing`, `.spacing--half`, `.spacing--double` etc to the elements parents in order to create space between elements. If you have to add a parent div strictly for spacing, that is completely acceptable.
- We use the variable `$padding` to keep spacing around objects consistent


#### Grid

- Built off Neat grids
- Starter grid is a 12 column grid with fixed 10px gutters (see `_config.grid.scss`).
- Columns must be created with a `.layout-NNN` class. Where `NNN` is one of `full`, `split-2`, `split-3`, or `split-4`. Column percentages are expressed as `.layout-split-2--25-75` where on desktop we expect a 2 column layout where the first column is 25% width and the second is 75% width.
- To avoid `.layout-full > .column` you can just use `.column-full`
- Gutters are defined at a fixed width per column.


#### Units of measure

- Please use the `rem()` function for all units, it will print a px fallback ex. `font-size: rem(15);`

#### Naming Classes

- Try to extract things you see repeating over and over into classes so you can reuse them for the sake of speed. We use an Expressive CSS approach: class names should be very descriptive and never abbreviated. Follow bem syntax but map to the property/value if only one style is captured. ex. `.text-align--center`, `.position--relative`. Please review the `_library.tools.scss` partial to see whats written and available for reuse.


#### Classing all the things

- Please use BEM syntax if necessary, leverage expressive classes as much as possible (see `_library.tools.scss`).

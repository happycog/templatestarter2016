## Sandbox Starter

### Grid

- The grid is a 12 column grid with fixed 10px gutters.
- Columns must be created with a `.layout-NNN` class. Where `NNN` is one of `full`, `split-2`, `split-3`, or `split-4`.
- To avoid `.layout-full > .column` you can just use `.column-full`
- Gutters are defined at a fixed width per column.
- To add vertical spacing use `.spacing` (or some variation)
- Verticl spacing is created on direct children of the `.spacing` element

### Typography

- Text styles should be defined via classes on elements in the HTML, classes like `.alpha-xxl`, see text-styles partial in PL for reference.
- Text style classes should _never_ be extended with `@extend` in Sass, in general, please do not use `@extend`


#### Spacing

- We're using the lobotomized owl techniqe for spacing on this project, meaning you should rarely is ever have to add margin-top/margin-bottom on elements for spacing. Instead, please add a class of `.spacing`, `.spacing-half`, `.spacing-double` etc to the elements parents in order to create space between elements. If you have to add a parent div strictly for spacing, that is ok. Please see PL implementation in the Spacing atom for example implementation.


### Units of measure

- Please use the rem() function for all units, it will print a px fallback, as opposed to straight px in the CSS ex. `font-size: rem(15);`

### Naming Classes

- Try to extract things you see repeating over and over into classes so you can reuse them for the sake of speed. We are ok with classes like `.background-blue`, `.background-gray` and put them in the _tools.scss partial for reuse.

# Data Explorer

Interactively explore your data directly in [atom](https://atom.io/) with [hydrogen](https://github.com/nteract/hydrogen/)!

The [nteract data-explorer](https://blog.nteract.io/designing-the-nteract-data-explorer-f4476d53f897) provides automatic data visualization, so you can get a feel for your data quickly and with minimal code!

![nteract data explorer in hydrogen](https://media.giphy.com/media/2sdkkttRWYG4Gf9BB9/giphy.gif)

:construction: This is a work in progress. Please open issues and pull requests!

:warning:
As this package has some open issues with styling, the following atom themes are recommended for now:

- :art: Atom One Light syntax theme
- :art: Atom One Light UI theme

## How to try it out:

Make sure you have installed:

- python, along with the [pandas data analysis library](http://pandas.pydata.org/pandas-docs/stable/install.html)
- At least one [python jupyter kernel](https://nteract.io/kernels)

Then, just start a python kernel in hydrogen and run the following code:

```python
import pandas as pd

# This is the important part:
pd.options.display.html.table_schema = True

# (Your dataframe here)
iris_filename = './iris.csv'
df1 = pd.read_csv(iris_filename)

df1
```

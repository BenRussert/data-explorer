# Hydrogen Data Explorer

The [nteract data-explorer](https://blog.nteract.io/designing-the-nteract-data-explorer-f4476d53f897) provides _automatic data visualization_
to view and get a feel for your data quickly and with minimal code!

![nteract data explorer in hydrogen](https://media.giphy.com/media/2sdkkttRWYG4Gf9BB9/giphy.gif)

:construction: 

This is a work in progress. Please open issues and pull requests!


## How to try it out:

Start a [hydrogen](https://atom.io/packages/hydrogen) python kernel:

```python
import pandas as pd

# This is the important part:
pd.options.display.html.table_schema = True
pd.options.display.max_rows = None

# (Your dataframe here)
iris_filename = './iris.csv'
df1 = pd.read_csv(iris_filename)

df1
```

Recommended for now:
* Atom One Light syntax theme 
* Atom One Light UI theme

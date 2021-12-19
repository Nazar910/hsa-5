# Tasks
* implement "autocomplete" functionality using ElasticSearch match queries over index of words
* allow up to 3 typos when word length > 7

# Implementation
* `word_dictionary.json` from https://github.com/dwyl/english-words as data for our index
* using simple analyzer for text field `word`

# Results

* search for word `algorithm`
```
Enter word you want to search for: algorithm
Word            | Score
----------------------------------
algorithm       | 12.416096
algorithms      | 11.03653
algorithmic     | 9.656964
algorism        | 9.312072
Enter word you want to search for: algoritfm
Word            | Score
----------------------------------
algorithm       | 11.03653
algorithms      | 9.656964
algorism        | 9.312072
Enter word you want to search for: algiritfm
Word            | Score
----------------------------------
algorithm       | 9.656964
Enter word you want to search for: amgiritfm
Word            | Score
----------------------------------

```
* search for words `cow` or `auto`
```
Enter word you want to search for: auto
Word            | Score
----------------------------------
auto            | 12.416096
Enter word you want to search for: auti
Word            | Score
----------------------------------
Enter word you want to search for: cow
Word            | Score
----------------------------------
cow             | 12.416096
Enter word you want to search for: ciw
Word            | Score
----------------------------------
```

# P.S.
When we use ngram analyzer alogn with `fuzziness` it returns interesting results:
```
Enter word you want to search for: cow
Word            | Score
----------------------------------
cowk            | 10.524136
cowl            | 10.524136
cowal           | 9.816866
cowan           | 9.816866
cowed           | 9.816866
cower           | 9.816866
cowle           | 9.816866
cowls           | 9.816866
cowage          | 9.198674
coward          | 9.198674
```
You see, we search for word `cow` and got all cow-like words except from "cow".

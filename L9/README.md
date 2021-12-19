# Tasks
* implement "autocomplete" functionality using ElasticSearch match queries over index of words

# Results

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

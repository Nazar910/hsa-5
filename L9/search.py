from elasticsearch import Elasticsearch
import requests
from more_itertools import flatten
from itertools import zip_longest


def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)


es = Elasticsearch()

INDEX_NAME = 'auto_complete_idx'

settings = {
    'analysis': {
        'analyzer': {
            'autocomplete': {
                'tokenizer': 'autocomplete',
                'filter': [
                    'lowercase'
                ]
            },
            'autocomplete_search': {
                'tokenizer': 'lowercase'
            }
        },
        'tokenizer': {
            'autocomplete': {
                'type': 'edge_ngram',
                'min_gram': 2,
                'max_gram': 10,
                'token_chars': [
                    'letter'
                ]
            }
        }
    }
}

mappings = {
    'properties': {
        'word': {
            'type': 'text',
            'analyzer': 'autocomplete',
            'search_analyzer': 'autocomplete_search'
        }
    }
}

# ngram for tokenizer
# fuzziness for search


def ensure_index():
    if not es.indices.exists(index=INDEX_NAME):
        print('About to ensure index')
        es.indices.create(index=INDEX_NAME,
                          mappings=mappings, settings=settings)
        print('About to load eng-dictionary')
        eng_words = requests.get(
            'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json').json().keys()
        print('About to insert eng words into index')
        for word_group in grouper(eng_words, 100):
            body = list(
                flatten(
                    map(
                        lambda w: [{'create': {}}, {'word': w}],
                        word_group
                    )
                )
            )
            es.bulk(index=INDEX_NAME, body=body, refresh=False)
        es.indices.refresh(index=INDEX_NAME)
        print('Done with ensuring index and index data')


def search():
    search_word = input('Enter word you want to search for: ')

    search_result = es.search(
        index=INDEX_NAME,
        query={
            'match': {
                'word': {
                    'query': search_word
                }
            }
        }
    )
    print('{:<15} {:<15}'.format('Word', '| Score'))
    print('----------------------------------')
    for hit in search_result['hits']['hits']:
        print('{:<15} {:<15}'.format(hit['_source']['word'], '| {}'.format(hit['_score'])))


if __name__ == '__main__':
    ensure_index()
    search()

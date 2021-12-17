from elasticsearch import Elasticsearch

es = Elasticsearch()

INDEX_NAME = 'auto_complete_idx'

if not es.indices.exists(index=INDEX_NAME):
    es.indices.create(index=INDEX_NAME)

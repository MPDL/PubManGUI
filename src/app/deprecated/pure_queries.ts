export const public_filter = [
    {
        term: {
            publicState: 'RELEASED'
        }
    },
    {
        term: {
            versionState: 'RELEASED'
        }
    }
];

export const title_query: any = (val: string) => ({
    multi_match: {
        query: val,
        type: 'phrase_prefix',
        fields: [
            'metadata.title',
            'metadata.alternativeTitles.value'
        ]
    }
});

export const genre_filter: any = (val: string) => ({
    term: {
        'metadata.genre': val
    }
});

export const person_id_query: any = (role: string, id: string) => (role ? ({
    nested: {
        path: 'metadata.creators',
        query: {
            bool: {
                must: [
                    {
                        term: {
                            'metadata.creators.role': role.toLocaleUpperCase()
                        }
                    },
                    {
                        term: {
                            'metadata.creators.person.identifier.id': id
                        }
                    }
                ]
            }
        }
    }
}) : ({
    term: {
        'metadata.creators.person.identifier.id': id
    }
}));

export const person_name_query: any = (role: string, id: string) => (role ? ({
    nested: {
        path: 'metadata.creators',
        query: {
            bool: {
                must: [
                    {
                        term: {
                            'metadata.creators.role': role.toLocaleUpperCase()
                        }
                    },
                    {
                        multi_match: {
                            query: id,
                            type: 'cross_fields',
                            operator: 'AND',
                            fields: [
                                'metadata.creators.person.givenName',
                                'metadata.creators.person.familyName'
                            ]
                        }
                    }
                ]
            }
        }
    }
}) : ({
    multi_match: {
        query: id,
        type: 'cross_fields',
        operator: 'AND',
        fields: [
            'metadata.creators.person.givenName',
            'metadata.creators.person.familyName'
        ]
    }
}));


export const ou_id_query = (val: string) => ({
    multi_match: {
        query: val,
        fields: [
            'metadata.creators.person.organizations.identifierPath',
            'metadata.creators.organization.identifierPath'
        ]
    }
});

export const ou_name_query = (val: string) => ({
    multi_match: {
        query: val,
        fields: [
            'metadata.creators.person.organizations.name',
            'metadata.creators.organization.name'
        ]
    }
});

export const ou_suggest = (val: string) => ({
    fields: ['objectId', 'name', 'parentAffiliation.name', 'ou_chain', 'mother'],
    runtime_mappings: {
        ou_chain: {
            type: 'keyword',
            script: {
                source: 'if (doc["parentAffiliation.name.keyword"].size() > 0) {emit(doc["name.keyword"].value + " - " + doc["parentAffiliation.name.keyword"].value)} else {emit(doc["name.keyword"].value)}'
            }
        },
        mother: {
            type: 'lookup',
            target_index: 'ous',
            input_field: 'parentAffiliation.objectId',
            target_field: 'objectId',
            fetch_fields: ['parentAffiliation.name']
        }
    },
    query: {
        multi_match: {
            query: val,
            type: 'phrase_prefix',
            fields: [
                'name',
                'parentAffiliation.name'
            ]
        }
    },
    size: 12
});

export const ctxs_suggest = (val: string) => ({
    query: {
        match: {
            'name.auto': val
        }
    }
});

export const date_query = (from: string, to: string) => {
    const from_format = (from.length === 4) ? '||/y' : (from.length === 7) ? '||/M' : '||/d';
    const to_format = to ? ((to.length === 4) ? '||/y' : (to.length === 7) ? '||/M' : '||/d') : '';
    const gte = from.concat(from_format);
    const lte = to && to_format ? to.concat(to_format) : null;
    return {
        bool: {
            should: [
                { range: { "metadata.datePublishedInPrint": { gte, lte } } },
                { range: { "metadata.datePublishedOnline": { gte, lte } } },
                { range: { "metadata.dateAccepted": { gte, lte } } },
                { range: { "metadata.dateSubmitted": { gte, lte } } },
                { range: { "metadata.dateModified": { gte, lte } } },
                { range: { "metadata.dateCreated": { gte, lte } } },
            ]
        }
    }
};
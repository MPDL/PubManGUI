export const aggs_params = {
    index: '',
    size: 0,
    aggregations: {
        name: {
            composite: {
                sources: [
                    {
                        source_name: {
                            terms: {
                                field: '',
                                order: '',
                            }
                        }
                    }
                ]
            }
        }
    }

};

interface AggregationParams {
    index: string;
    size: 0;
    aggregations: unknown;
}

interface CompositeAggregation {
    composite: {
        sources: []
    };
}

type keyOrCount = '_key' | '_count';

interface TermsAggregation {
    terms: {
        field: string;
        order?: {
            [prop in keyOrCount]?: 'asc' | 'desc';
        };
        size?: number;
    };
}

interface DateAggregation {
    date_histogram: {
        field: string,
        calendar_interval: string,
        format: string
    };
}

interface NestedAggregation {
    nested: {
        path: string
    };
    aggregations: unknown;
}

export const term_filter = {
    index: '',
    size: 25,
    sort: Array<any>,
    track_total_hits: true,
    query: {
        term: {}
    }
};

export { AggregationParams, TermsAggregation, CompositeAggregation, DateAggregation, NestedAggregation };

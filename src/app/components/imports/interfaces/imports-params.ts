// Fetch
export interface GetCrossrefParams { 
        contextId: string,
        identifier: string
}

export interface GetArxivParams { 
        contextId: string,
        identifier: string,
        fullText: string
}

// Import
export interface PostImportParams { 
        contextId: string,
        importName: string,
        format: string,
        formatConfig?: string
}

// Item State
export interface DeletePubItemsParams { 
        itemIds: string[],
}

export interface SubmitPubItemsParams { 
        itemIds: string[],
}

export interface RevisePubItemsParams { 
        itemIds: string[],
}

export interface ReleasePubItemsParams { 
        itemIds: string[],
}

export interface WithdrawPubItemsParams { 
        itemIds: string[],
}

// Context
export interface ChangeContextParams {
        itemIds: string[],
        contextFrom: string,
        contextTo: string,
}

// Local Tags
export interface AddLocalTagsParams {
        itemIds: string[],
        localTags: string[],
}

export interface ChangeLocalTagParams {
        itemIds: string[],
        localTagFrom: string,
        localTagTo: string,
}

// Genre
export interface ChangeGenreParams {
        itemIds: string[],
        genreFrom: string,
        genreTo: string,
        degreeType: string,
}

// Metadata
// Files
export interface ChangeFileVisibilityParams {
        itemIds: string[],
        fileVisibilityFrom: string,
        fileVisibilityTo: string,
}

export interface ChangeFileContentCategoryParams {
        itemIds: string[],
        fileContentCategoryFrom: string,
        fileContentCategoryTo: string,
}

export interface ReplaceFileAudienceParams {
        itemIds: string[],
        allowedAudienceIds: string[],
}

// External References
export interface ChangeExternalReferenceContentCategoryParams {
        itemIds: string[],
        externalReferenceContentCategoryFrom: string,
        externalReferenceContentCategoryTo: string,
}

// ORCID
export interface ReplaceOrcidParams {
        itemIds: string[],
        creatorId: string,
        orcid: string,
}

// Publication
export interface ChangeReviewMethodParams {
        itemIds: string[],
        reviewMethodFrom: string,
        reviewMethodTo: string,
}

export interface AddKeywordsParams {
        itemIds: string[],
        keywords: string,
}

export interface ReplaceKeywordsParams {
        itemIds: string[],
        keywords: string,
}

export interface ChangeKeywordsParams {
        itemIds: string[],
        keywordsFrom: string,
        keywordsTo: string,
}

// Source
export interface ChangeSourceGenreParams {
        itemIds: string[],
        sourceGenreFrom: string,
        sourceGenreTo: string,
}

export interface ReplaceSourceEditionParams {
        itemIds: string[],
        sourceNumber: number,
        edition: string,
}

export interface AddSourceIdentiferParams {
        itemIds: string[],
        sourceNumber: number,
        sourceIdentifierType: string,
        sourceIdentifier: string,
}

export interface ChangeSourceIdentifierParams {
        itemIds: string[],
        sourceNumber: number,
        sourceIdentifierType: string,
        sourceIdentifierFrom: string,
        sourceIdentifierTo: string,
}

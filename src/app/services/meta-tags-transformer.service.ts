import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AlternativeTitleType, CreatorType, IdType, ItemVersionVO, MdsPublicationGenre, Visibility, Storage } from "../model/inge";



/**
 * MetaTag model for internal representation
 */
interface MetaTag {
  name: string;
  content: string;
}

/**
 * Service to transform ItemVersionVO to HTML meta tags for SEO and citation indexing.
 * Supports multiple meta tag schemas:
 * - Highwire Press Citation (for Google Scholar)
 * - Dublin Core (DC)
 * - Standard Meta Tags
 */
@Injectable({
  providedIn: 'root'
})
export class MetaTagsTransformerService {

  // Highwire Press Citation tag keys
  private readonly HIGHWIRE_PREFIX = 'citation_';
  private readonly HIGHWIRE_KEYS = {
    title: 'citation_title',
    author: 'citation_author',
    author_affiliation: 'citation_author_institution',
    publication_date: 'citation_publication_date',
    pdf_url: 'citation_pdf_url',
    language: 'citation_language',
    fulltext_html_url: 'citation_fulltext_html_url',
    doi: 'citation_doi',
    arxiv_id: 'citation_arxiv_id',
    pmid: 'citation_pmid',
    isbn: 'citation_isbn',
    keywords: 'citation_keywords',
    conference: 'citation_conference_title',
    dissertation_institution: 'citation_dissertation_institution',
    journal_title: 'citation_journal_title',
    journal_abbrev: 'citation_journal_abbrev',
    volume: 'citation_volume',
    issue: 'citation_issue',
    firstpage: 'citation_firstpage',
    lastpage: 'citation_lastpage',
    publisher: 'citation_publisher',
    degree: 'citation_dissertation_name',
    inbook_title: 'citation_inbook_title',
    issn: 'citation_issn'
  };

  // Dublin Core tag keys
  private readonly DC_KEYS = {
    title: 'DC.title',
    creator: 'DC.creator',
    issued: 'DC.issued',
    identifier: 'DC.identifier',
    language: 'DC.language',
    subject: 'DC.subject',
    publisher: 'DC.publisher',
    relation_ispartof: 'DC.relation.ispartof',
    citation_volume: 'DC.citation.volume',
    citation_issue: 'DC.citation.issue',
    citation_spage: 'DC.citation.spage',
    citation_epage: 'DC.citation.epage',
    citation_issn: 'citation_issn'
  };

  // Genre to publication type mapping
  private readonly GENRES = {
    'article': 'journal',
    'newspaper-article': 'journal',
    'magazine-article': 'journal',
    'review-article': 'journal',
    'book-item': 'book',
    'contribution-to-collected-edition': 'book',
    'contribution-to-festschrift': 'book',
    'contribution-to-handbook': 'book',
    'thesis': 'thesis',
    'conference-paper': 'conference',
    'report': 'report'
  };

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  /**
   * Main transformation function - takes ItemVersionVO and sets all meta tags
   * @param itemVersion ItemVersionVO object (JSON from backend)
   * @param tagSchema Which meta tag schema to use: 'highwire', 'dc', or 'all'
   */
  public transformAndSetMetaTags(
    itemVersion: ItemVersionVO
  ): void {
    if (!itemVersion) {
      console.warn('ItemVersionVO is empty or null');
      return;
    }

    const metaTags: MetaTag[] = [];


    metaTags.push(...this.generateHighwireMetaTags(itemVersion));


    // Set page title
    //if (itemVersion.metadata?.title) {
    //this.title.setTitle(this.stripHtml(itemVersion.metadata.title));
    //}

    // Apply all meta tags
    this.applyMetaTags(metaTags);
  }

  /**
   * Generate Highwire Press Citation meta tags (for Google Scholar)
   */
  private generateHighwireMetaTags(itemVersion: ItemVersionVO): MetaTag[] {
    console.log('Generating Highwire meta tags for itemVersion:', itemVersion);
    const tags: MetaTag[] = [];
    const metadata = itemVersion.metadata;
    const genre = itemVersion.metadata.genre;

    if (!metadata) {
      return tags;
    }

    // Title
    if (metadata.title) {
      tags.push({
        name: this.HIGHWIRE_KEYS.title,
        content: this.stripHtml(metadata.title)
      });
      tags.push({
        name: this.DC_KEYS.title,
        content: this.stripHtml(metadata.title)
      });
    }

    // Degree (thesis)
    if (genre === MdsPublicationGenre.THESIS && metadata.degree) {
      const degreeValue = metadata.degree;
      if (degreeValue) {
        tags.push({
          name: this.HIGHWIRE_KEYS.degree,
          content: degreeValue
        });
      }
    }

    // Publication Date
    const pubDate = this.getPublicationDate(metadata);
    if (pubDate) {
      tags.push({
        name: this.HIGHWIRE_KEYS.publication_date,
        content: this.formatDate(pubDate)
      });
      tags.push({
        name: this.DC_KEYS.issued,
        content: this.formatDate(pubDate)
      });
    }

    // Authors
    if (metadata.creators && Array.isArray(metadata.creators)) {
      for (const creator of metadata.creators) {
        // Filter out non-author roles
        if (creator.type === CreatorType.PERSON) {
          if (!this.isExcludedRole(creator.role)) {
            if (creator.person?.familyName) {
              const authorName = creator.person.givenName
                ? `${creator.person.familyName}, ${creator.person.givenName}`
                : creator.person.familyName;
              tags.push({
                name: this.HIGHWIRE_KEYS.author,
                content: authorName
              });
              tags.push({
                name: this.DC_KEYS.creator,
                content: authorName
              });
            }

            // Author affiliations
            if (creator.person?.organizations && Array.isArray(creator.person.organizations)) {
              for (const affiliation of creator.person.organizations) {

                if (genre === MdsPublicationGenre.THESIS && !metadata.publishingInfo?.publisher) {
                  tags.push({
                    name: this.HIGHWIRE_KEYS.dissertation_institution,
                    content: affiliation.name || ''
                  });
                } else {
                  tags.push({
                    name: this.HIGHWIRE_KEYS.author_affiliation,
                    content: affiliation.name || ''
                  });
                }
              }
            }
          }
        }
        else if (creator.type === CreatorType.ORGANIZATION) {

          if (creator.organization?.name) {
            tags.push({
              name: this.DC_KEYS.creator,
              content: creator.organization.name
            });

            if (genre === MdsPublicationGenre.THESIS && !metadata.publishingInfo?.publisher) {
              tags.push({
                name: this.HIGHWIRE_KEYS.dissertation_institution,
                content: creator.organization.name
              });
            }
            else {
              tags.push({
                name: this.HIGHWIRE_KEYS.author,
                content: creator.organization.name
              });

            }

          }
        }
      }

      // Language
      if (metadata.languages) {
        for (const language of metadata.languages) {
          tags.push({
            name: this.HIGHWIRE_KEYS.language,
            content: language
          });
          tags.push({
            name: this.DC_KEYS.language,
            content: language
          });
        }
      }

      // DOI
      const doi = this.extractIdentifier(itemVersion, IdType.DOI);
      if (doi) {
        tags.push({
          name: this.HIGHWIRE_KEYS.doi,
          content: doi
        });
        tags.push({
          name: this.DC_KEYS.identifier,
          content: `https://doi.org/${doi}`
        });
      }

      // ArXiv ID
      const arxiv = this.extractIdentifier(itemVersion, IdType.ARXIV);
      if (arxiv) {
        tags.push({
          name: this.HIGHWIRE_KEYS.arxiv_id,
          content: arxiv
        });
      }

      // PMID
      const pmid = this.extractIdentifier(itemVersion, IdType.PMID);
      if (pmid) {
        tags.push({
          name: this.HIGHWIRE_KEYS.pmid,
          content: pmid
        });
      }

      // ISBN
      const isbn = this.extractIdentifier(itemVersion, IdType.ISBN);
      if (isbn && this.isApplicableGenre(genre, [MdsPublicationGenre.BOOK_ITEM, MdsPublicationGenre.CONTRIBUTION_TO_COLLECTED_EDITION, MdsPublicationGenre.CONTRIBUTION_TO_FESTSCHRIFT, MdsPublicationGenre.CONTRIBUTION_TO_HANDBOOK])) {
        tags.push({
          name: this.HIGHWIRE_KEYS.isbn,
          content: isbn
        });
        tags.push({
          name: this.DC_KEYS.identifier,
          content: `urn:ISBN:${isbn}`
        });
      }

      const issn = this.extractIdentifier(itemVersion, IdType.ISSN);
      if (issn) {
        tags.push({
          name: this.DC_KEYS.citation_issn,
          content: `urn:ISSN:${issn}`
        });
      }

      // Keywords
      if (metadata.freeKeywords) {

        tags.push({
          name: this.HIGHWIRE_KEYS.keywords,
          content: metadata.freeKeywords
        });
        tags.push({
          name: this.DC_KEYS.subject,
          content: metadata.freeKeywords
        });
      }
    }



    // Publisher
    if (metadata.publishingInfo?.publisher) {
      const publisherName = this.normalizeSpace(metadata.publishingInfo.publisher);
      tags.push({
        name: this.DC_KEYS.publisher,
        content: publisherName
      });
      if (genre === MdsPublicationGenre.THESIS) {
        tags.push({
          name: this.HIGHWIRE_KEYS.dissertation_institution,
          content: publisherName
        });
      } else {
        tags.push({
          name: this.HIGHWIRE_KEYS.publisher,
          content: publisherName
        });
      }
    }

    // Event / Conference title (XSL has template for pub:publication/event:event/dc:title)
    const eventTitle = metadata.event?.title;
    if (eventTitle && this.isApplicableGenre(genre, [MdsPublicationGenre.CONFERENCE_PAPER, MdsPublicationGenre.PROCEEDINGS, MdsPublicationGenre.CONFERENCE_REPORT, MdsPublicationGenre.TALK_AT_EVENT, MdsPublicationGenre.COURSEWARE_LECTURE, MdsPublicationGenre.POSTER])) {
      tags.push({
        name: this.HIGHWIRE_KEYS.conference,
        content: eventTitle
      });
    }



    // Fulltext Links
    tags.push(...this.generateFulltextLinks(itemVersion));

    // Source/Journal specific tags
    tags.push(...this.generateSourceMetaTags(itemVersion, genre));

    return tags;
  }

  /**
   * Generate Dublin Core meta tags
   */
  private generateDublinCoreMetaTags(itemVersion: ItemVersionVO): MetaTag[] {
    const tags: MetaTag[] = [];
    const metadata = itemVersion.metadata;

    if (!metadata) {
      return tags;
    }

    //SUBJECT???










    return tags;
  }

  /**
   * Generate source/journal specific meta tags (Highwire)
   */
  private generateSourceMetaTags(itemVersion: ItemVersionVO, genre?: MdsPublicationGenre): MetaTag[] {
    const tags: MetaTag[] = [];
    const source = itemVersion.metadata.sources?.[0]; // Assuming first source is the main one, can be adjusted if needed

    if (!source) {
      return tags;
    }

    if (source.title) {
      tags.push({
        name: this.DC_KEYS.relation_ispartof,
        content: source.title
      });

      // Journal Title
      if (this.isApplicableGenre(genre, [MdsPublicationGenre.ARTICLE, MdsPublicationGenre.NEWSPAPER_ARTICLE, MdsPublicationGenre.BOOK_REVIEW, MdsPublicationGenre.MAGAZINE_ARTICLE, MdsPublicationGenre.REVIEW_ARTICLE])) {
        tags.push({
          name: this.HIGHWIRE_KEYS.journal_title,
          content: source.title
        });
      }

      // Book Title (for book chapters)
      if (this.isApplicableGenre(genre, [MdsPublicationGenre.BOOK_ITEM, MdsPublicationGenre.CONTRIBUTION_TO_COLLECTED_EDITION, MdsPublicationGenre.CONTRIBUTION_TO_FESTSCHRIFT, MdsPublicationGenre.CONTRIBUTION_TO_HANDBOOK])) {
        tags.push({
          name: this.HIGHWIRE_KEYS.inbook_title,
          content: source.title
        });
      }



    }

    // Journal Abbreviation
    if (this.isApplicableGenre(genre, [MdsPublicationGenre.ARTICLE, MdsPublicationGenre.NEWSPAPER_ARTICLE, MdsPublicationGenre.MAGAZINE_ARTICLE, MdsPublicationGenre.REVIEW_ARTICLE])) {
      source.alternativeTitles?.filter(alt => alt.type === AlternativeTitleType.ABBREVIATION)?.forEach(alt => {
        if (alt.value) {
          tags.push({
            name: this.HIGHWIRE_KEYS.journal_abbrev,
            content: alt.value
          });
        }
      });
    }

    // Volume
    if (source.volume) {
      tags.push({
        name: this.DC_KEYS.citation_volume,
        content: source.volume
      });
      if (this.isApplicableGenre(genre, [MdsPublicationGenre.ARTICLE, MdsPublicationGenre.NEWSPAPER_ARTICLE, MdsPublicationGenre.MAGAZINE_ARTICLE, MdsPublicationGenre.REVIEW_ARTICLE])) {
        tags.push({
          name: this.HIGHWIRE_KEYS.volume,
          content: source.volume
        });
      }
    }

    // Issue
    if (source.issue) {
      tags.push({
        name: this.DC_KEYS.citation_issue,
        content: source.issue
      });
      if (this.isApplicableGenre(genre, [MdsPublicationGenre.ARTICLE, MdsPublicationGenre.NEWSPAPER_ARTICLE, MdsPublicationGenre.MAGAZINE_ARTICLE, MdsPublicationGenre.REVIEW_ARTICLE])) {
        tags.push({
          name: this.HIGHWIRE_KEYS.issue,
          content: source.issue
        });
      }
    }

    // Start Page
    if (source.startPage) {
      tags.push({
        name: this.DC_KEYS.citation_spage,
        content: source.startPage
      });
      tags.push({
        name: this.HIGHWIRE_KEYS.firstpage,
        content: source.startPage
      });
    }

    // End Page
    if (source.endPage) {
      if (source.endPage) {
        tags.push({
          name: this.DC_KEYS.citation_epage,
          content: source.endPage
        });
      }
      tags.push({
        name: this.HIGHWIRE_KEYS.lastpage,
        content: source.endPage
      });
    }

    // Publisher
    if (source.publishingInfo?.publisher) {
      tags.push({
        name: this.HIGHWIRE_KEYS.publisher,
        content: source.publishingInfo.publisher
      });
    }

    // ISSN
    const issn = source.identifiers?.find(id => id.type === IdType.ISSN)?.id;
    if (issn && this.isApplicableGenre(genre, [MdsPublicationGenre.ARTICLE, MdsPublicationGenre.NEWSPAPER_ARTICLE, MdsPublicationGenre.MAGAZINE_ARTICLE, MdsPublicationGenre.REVIEW_ARTICLE])) {
      tags.push({
        name: this.HIGHWIRE_KEYS.issn,
        content: issn
      });
    }

    // ISBN
    const isbn = source.identifiers?.find(id => id.type === IdType.ISBN)?.id;
    if (isbn && this.isApplicableGenre(genre, [MdsPublicationGenre.BOOK_ITEM, MdsPublicationGenre.CONTRIBUTION_TO_COLLECTED_EDITION, MdsPublicationGenre.CONTRIBUTION_TO_FESTSCHRIFT, MdsPublicationGenre.CONTRIBUTION_TO_HANDBOOK])) {
      tags.push({
        name: this.HIGHWIRE_KEYS.isbn,
        content: isbn
      });
    }

    return tags;
  }



  /**
   * Generate fulltext link meta tags
   */
  private generateFulltextLinks(itemVersion: ItemVersionVO): MetaTag[] {
    const tags: MetaTag[] = [];

    if (!itemVersion.files || !Array.isArray(itemVersion.files)) {
      return tags;
    }

    for (const file of itemVersion.files) {
      // Only public files
      if (file.visibility !== Visibility.PUBLIC) {
        continue;
      }

      // Only allowed content categories
      const allowedCategories = ['any-fulltext', 'pre-print', 'post-print', 'publisher-version'];
      if (!allowedCategories.includes(file.metadata.contentCategory || '')) {
        continue;
      }

      // Internal managed files
      if (file.storage === Storage.INTERNAL_MANAGED && file.content) {
        if (file.mimeType === 'application/pdf') {
          tags.push({
            name: this.HIGHWIRE_KEYS.pdf_url,
            content: file.content
          });
        } else if (file.mimeType === 'text/html' || file.mimeType === 'application/xhtml+xml') {
          tags.push({
            name: this.HIGHWIRE_KEYS.fulltext_html_url,
            content: file.content
          });
        }
      }

      // External URLs
      if (file.storage === Storage.EXTERNAL_URL && file.content) {
        tags.push({
          name: this.HIGHWIRE_KEYS.fulltext_html_url,
          content: file.content
        });
      }
    }

    return tags;
  }

  /**
   * Extract identifier by type from itemVersion
   */
  private extractIdentifier(itemVersion: ItemVersionVO, type: IdType): string | undefined {
    // Check in source identifiers
    if (itemVersion.metadata.identifiers) {
      const found = itemVersion.metadata.identifiers.find(id => id.type === type);
      if (found) {
        return found.id;
      }
    }

    // Could also check in metadata if stored differently
    return undefined;
  }

  /**
   * Get publication date in priority order
   */
  private getPublicationDate(metadata: any): string | undefined {
    return (
      metadata.issued ||
      metadata.publishedOnline ||
      metadata.dateAccepted ||
      metadata.dateSubmitted ||
      metadata.modified ||
      metadata.created
    );
  }

  /**
   * Check if role should be excluded from authors
   */
  private isExcludedRole(role?: string): boolean {
    const excludedRoles = [
      'referee',
      'advisor',
      'honoree',
      'translator',
      'transcriber',
      'contributor'
    ];
    return role ? excludedRoles.includes(role.toLowerCase()) : false;
  }

  /**
   * Check if genre is applicable for the given list
   */
  private isApplicableGenre(genre: MdsPublicationGenre | undefined, applicableGenres: MdsPublicationGenre[]): boolean {
    if (!genre) {
      return false;
    }
    return applicableGenres.includes(genre);
  }

  /**
   * Format date for meta tags (replace dashes with slashes)
   */
  private formatDate(date: string): string {
    return date.replace(/-/g, '/');
  }

  /**
   * Normalize space - remove extra spaces
   */
  private normalizeSpace(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtml(html: string): string {
    if (!html) {
      return '';
    }
    // Fallback for server-side: simple tag stripper + basic entity decoding
    const withoutTags = html.replace(/<[^>]*>/g, '');
    return withoutTags.trim();
  }


  /**
   * Apply meta tags to the document
   */
  private applyMetaTags(tags: MetaTag[]): void {
    for (const tag of tags) {
      if (this.isValidTag(tag)) {
        // Remove existing tag if it exists
        this.meta.removeTag(`name='${tag.name}'`);
        // Add new tag
        this.meta.addTag({ name: tag.name, content: tag.content });
      }
    }
  }

  /**
   * Validate meta tag (must have both name and content)
   */
  private isValidTag(tag: MetaTag): boolean {
    return !!(
      tag &&
      tag.name &&
      this.normalizeSpace(tag.name).length > 0 &&
      tag.content &&
      this.normalizeSpace(tag.content).length > 0
    );
  }
}


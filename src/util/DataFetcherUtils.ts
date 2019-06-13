import _ from "lodash";

import GenomeNexusAPI from "../generated/GenomeNexusAPI";
import GenomeNexusAPIInternal from "../generated/GenomeNexusAPIInternal";
import OncoKbAPI from "../generated/OncoKbAPI";
import {Mutation} from "../model/Mutation";
import {IOncoKbData} from "../model/OncoKb";
import {uniqueGenomicLocations} from "./MutationUtils";
import {indexAnnotationsByGenomicLocation} from "./MutationAnnotator";

export const DEFAULT_MUTATION_ALIGNER_URL_TEMPLATE = "https://www.cbioportal.org/getMutationAligner.json?pfamAccession=<%= pfamDomainId %>";
export const DEFAULT_MY_GENE_URL_TEMPLATE = "https://mygene.info/v3/gene/<%= entrezGeneId %>?fields=uniprot";
export const DEFAULT_UNIPROT_ID_URL_TEMPLATE = "https://www.uniprot.org/uniprot/?query=accession:<%= swissProtAccession %>&format=tab&columns=entry+name";
export const DEFAULT_GENOME_NEXUS_URL = "https://www.genomenexus.org/";
export const DEFAULT_ONCO_KB_URL = "https://www.oncokb.org/";
export const ONCOKB_DEFAULT_DATA: IOncoKbData = {
    indicatorMap : {}
};

const DEFAULT_GENOME_NEXUS_CLIENT = initGenomeNexusClient();

export function getUrl(urlTemplate: string, templateVariables: any) {
    return _.template(urlTemplate)(templateVariables);
}

export async function fetchVariantAnnotationsByMutation(mutations: Partial<Mutation>[],
                                                        fields: string[] = ["annotation_summary"],
                                                        isoformOverrideSource: string = "uniprot",
                                                        client: Partial<GenomeNexusAPI> = DEFAULT_GENOME_NEXUS_CLIENT)
{
    const genomicLocations = uniqueGenomicLocations(mutations);

    return genomicLocations.length > 0 && client.fetchVariantAnnotationByGenomicLocationPOST ?
        await client.fetchVariantAnnotationByGenomicLocationPOST({
            genomicLocations,
            fields,
            isoformOverrideSource
        }
    ): [];
}

export async function fetchVariantAnnotationsIndexedByGenomicLocation(mutations: Partial<Mutation>[],
                                                                      fields: string[] = ["annotation_summary"],
                                                                      isoformOverrideSource: string = "uniprot",
                                                                      client: Partial<GenomeNexusAPI> = DEFAULT_GENOME_NEXUS_CLIENT)
{
    const variantAnnotations = await fetchVariantAnnotationsByMutation(mutations, fields, isoformOverrideSource, client);
    return indexAnnotationsByGenomicLocation(variantAnnotations);
}

export function initGenomeNexusClient(genomeNexusUrl?: string): GenomeNexusAPI {
    return new GenomeNexusAPI(genomeNexusUrl || DEFAULT_GENOME_NEXUS_URL);
}

export function initGenomeNexusInternalClient(genomeNexusUrl?: string): GenomeNexusAPIInternal {
    return new GenomeNexusAPIInternal(genomeNexusUrl || DEFAULT_GENOME_NEXUS_URL);
}

export function initOncoKbClient(oncoKbUrl?: string): OncoKbAPI {
    return new OncoKbAPI(oncoKbUrl || DEFAULT_ONCO_KB_URL);
}
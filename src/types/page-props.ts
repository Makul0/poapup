// src/types/page-props.ts

// Define the base search params interface
export interface BaseSearchParams {
    [key: string]: string | string[] | undefined;
  }
  
  // Define the base page props interface
  export interface BasePageProps {
    params: Record<string, string>;
    searchParams: BaseSearchParams;
  }
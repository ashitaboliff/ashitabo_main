'use server'

import Loading from '@/components/ui/atoms/Loading'
import VideoListPage from '@/features/video/components/VideoListPage'
import { Suspense } from 'react'
import { searchYoutubeDetailsAction } from '@/features/video/components/actions'
import { YoutubeDetail, YoutubeSearchQuery } from '@/features/video/types'
import { ErrorType } from '@/utils/types/responseTypes'

const parseVideoPageSearchParams = async (params: URLSearchParams): Promise<YoutubeSearchQuery> => {
  const defaultQuery: YoutubeSearchQuery = {
    liveOrBand: 'band',
    bandName: '',
    liveName: '',
    tag: [],
    tagSearchMode: 'or',
    sort: 'new',
    page: 1,
    videoPerPage: 15,
  };
	return {
		liveOrBand:
			(params.get('liveOrBand') as 'live' | 'band') ??
			defaultQuery.liveOrBand,
		bandName: params.get('bandName') ?? defaultQuery.bandName,
		liveName: params.get('liveName') ?? defaultQuery.liveName,
		tag: (params.getAll('tag') as string[]) ?? defaultQuery.tag,
		tagSearchMode:
			(params.get('tagSearchMode') as 'and' | 'or') ??
			defaultQuery.tagSearchMode,
		sort: (params.get('sort') as 'new' | 'old') ?? defaultQuery.sort,
		page: Number(params.get('page')) || defaultQuery.page,
		videoPerPage:
			Number(params.get('videoPerPage')) || defaultQuery.videoPerPage,
	}
}


interface VideoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: VideoPageProps) => {
  const queryParams = new URLSearchParams();
  if (await searchParams) {
    for (const [key, value] of Object.entries(await searchParams)) {
      if (typeof value === 'string') {
        queryParams.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      }
    }
  }

  const currentQuery = await parseVideoPageSearchParams(queryParams);
  const searchParamsString = queryParams.toString(); // keyとして使用する文字列

  let initialYoutubeDetails: YoutubeDetail[] = [];
  let initialPageMax = 1;
  let initialIsLoading = false; // Data fetching happens on server, so client initially is not loading
  let initialError: ErrorType | undefined = undefined;

  const res = await searchYoutubeDetailsAction(currentQuery);

  if (res.status === 200) {
    initialYoutubeDetails = res.response.results;
    initialPageMax = Math.ceil(res.response.totalCount / currentQuery.videoPerPage) || 1;
  } else {
    initialError = {
      status: res.status,
      response: String(res.response),
    };
    console.error("Failed to fetch youtube details:", res.response);
  }

	return (
		<Suspense fallback={<Loading />}>
			<VideoListPage
            key={searchParamsString}
            initialYoutubeDetails={initialYoutubeDetails}
            initialPageMax={initialPageMax}
            initialIsLoading={initialIsLoading}
            initialError={initialError}
          />
		</Suspense>
	)
}

export default Page

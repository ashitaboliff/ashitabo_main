export const parseDateString = (dateString: string): Date => {
	const [year, month, day] = dateString.split('-').map(Number)
	return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export const JSTToUTC = (date: Date): Date => {
	return new Date(date.getTime() - 9 * 60 * 1000 * 60)
}

export const UTCToJST = (date: Date): Date => {
	return new Date(date.getTime() + 9 * 60 * 1000 * 60)
}

/**
 * 今年から10年前まで、5年後までの "XX年度" のオブジェクトを生成する
 * @returns "XX年度"のオブジェクト
 */
export const generateFiscalYearObject = (): Record<string, string> => {
	const currentYear = generateAcademicYear() // 現在の年を取得
	const startYear = currentYear - 10 // 10年前
	const endYear = currentYear + 5 // 5年後

	// "XX年度"のオブジェクトを生成
	const fiscalYearObject: Record<string, string> = {}

	for (let year = startYear; year <= endYear; year++) {
		const value = `${year % 100}年度` // 西暦の下2桁で "XX年度"を作成
		const key = `${year % 100}` // 下2桁の数字を文字列として key に設定
		fiscalYearObject[key] = value
	}

	return fiscalYearObject
}

/**
 * 今年度の西暦を生成する
 * @returns
 */
export const generateAcademicYear = () => {
	const today = new Date()
	const currentYearFull = today.getFullYear() // 4桁の西暦
	const currentMonth = today.getMonth() + 1 // 月 (0が1月なので+1)

	// 学年度の調整（1月から3月は前年を使用）
	const academicYear = currentMonth <= 3 ? currentYearFull - 1 : currentYearFull
	const academicYearLastTwoDigits = academicYear

	return academicYearLastTwoDigits
}

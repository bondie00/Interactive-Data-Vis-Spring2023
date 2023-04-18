import pandas as pd

df = pd.read_csv('nfl_offensive_stats.csv', low_memory=False)

df['point_difference'] = abs(df['home_score'] - df['vis_score'])
df.loc[(df['home_team'] == df['team']) & (df['home_score'] > df['vis_score']), "win_lose"] = "win"
df.loc[(df['home_team'] == df['team']) & (df['home_score'] < df['vis_score']), "win_lose"] = "lose"
df.loc[(df['vis_team'] == df['team']) & (df['home_score'] > df['vis_score']), "win_lose"] = "lose"
df.loc[(df['vis_team'] == df['team']) & (df['home_score'] < df['vis_score']), "win_lose"] = "win"
df.loc[(df['home_score'] == df['vis_score']), "win_lose"] = "tie"



#df.loc[df['vis_team'] == df['team'], "team_score"] = df['vis_score']



df.to_csv('nfl_offensive_stats.csv')
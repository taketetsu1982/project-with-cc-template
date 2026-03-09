.PHONY: up down build logs migrate test lint format

# 開発環境
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

# データベース
migrate:
	# {マイグレーションコマンド}

# テスト
test:
	# {テストコマンド}

# コード品質
lint:
	# {Lintコマンド}

format:
	# {フォーマットコマンド}

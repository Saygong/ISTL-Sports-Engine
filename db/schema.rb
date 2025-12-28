# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_28_140514) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "fields", force: :cascade do |t|
    t.integer "courts"
    t.datetime "created_at", null: false
    t.string "description"
    t.integer "max_seats"
    t.string "name"
    t.integer "surface", default: 0, null: false
    t.datetime "updated_at", null: false
  end

  create_table "match_results", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description"
    t.bigint "match_id"
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_match_results_on_match_id"
  end

  create_table "matches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "date"
    t.bigint "referee_id"
    t.bigint "tournament_id"
    t.datetime "updated_at", null: false
    t.index ["referee_id"], name: "index_matches_on_referee_id"
    t.index ["tournament_id"], name: "index_matches_on_tournament_id"
  end

  create_table "players_match_results", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "match_result_id"
    t.bigint "player_id"
    t.integer "player_status", null: false
    t.datetime "updated_at", null: false
    t.index ["match_result_id"], name: "index_players_match_results_on_match_result_id"
    t.index ["player_id"], name: "index_players_match_results_on_player_id"
  end

  create_table "players_matches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "match_id"
    t.bigint "player_id"
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_players_matches_on_match_id"
    t.index ["player_id"], name: "index_players_matches_on_player_id"
  end

  create_table "players_tournaments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "player_id"
    t.bigint "tournament_id"
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_players_tournaments_on_player_id"
    t.index ["tournament_id"], name: "index_players_tournaments_on_tournament_id"
  end

  create_table "sports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description"
    t.integer "format_kind", default: 0, null: false
    t.integer "gender", default: 0, null: false
    t.datetime "max_age"
    t.datetime "min_age"
    t.datetime "updated_at", null: false
    t.integer "variant_kind", default: 0, null: false
  end

  create_table "tournaments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description"
    t.datetime "end_date"
    t.bigint "field_id"
    t.string "name"
    t.bigint "organizer_id"
    t.bigint "sport_id"
    t.datetime "start_date"
    t.datetime "updated_at", null: false
    t.index ["field_id"], name: "index_tournaments_on_field_id"
    t.index ["organizer_id"], name: "index_tournaments_on_organizer_id"
    t.index ["sport_id"], name: "index_tournaments_on_sport_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "allow_password_change", default: false
    t.datetime "birthdate"
    t.datetime "confirmation_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.jsonb "data", default: {}, null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.integer "gender", default: 0, null: false
    t.string "last_name"
    t.string "provider", default: "email", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.json "tokens"
    t.string "type", default: "User"
    t.string "uid", default: "", null: false
    t.string "unconfirmed_email"
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["data"], name: "index_users_on_data", using: :gin
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "match_results", "matches"
  add_foreign_key "matches", "tournaments"
  add_foreign_key "matches", "users", column: "referee_id"
  add_foreign_key "players_match_results", "match_results"
  add_foreign_key "players_match_results", "users", column: "player_id"
  add_foreign_key "players_matches", "matches"
  add_foreign_key "players_matches", "users", column: "player_id"
  add_foreign_key "players_tournaments", "tournaments"
  add_foreign_key "players_tournaments", "users", column: "player_id"
  add_foreign_key "tournaments", "fields"
  add_foreign_key "tournaments", "sports"
  add_foreign_key "tournaments", "users", column: "organizer_id"
end

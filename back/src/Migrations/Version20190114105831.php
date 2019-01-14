<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190114105831 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE mtm_series_to_categories (series_id INT NOT NULL, category_id INT NOT NULL, PRIMARY KEY(series_id, category_id))');
        $this->addSql('CREATE INDEX IDX_D87FDB7D5278319C ON mtm_series_to_categories (series_id)');
        $this->addSql('CREATE INDEX IDX_D87FDB7D12469DE2 ON mtm_series_to_categories (category_id)');
        $this->addSql('ALTER TABLE mtm_series_to_categories ADD CONSTRAINT FK_D87FDB7D5278319C FOREIGN KEY (series_id) REFERENCES series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mtm_series_to_categories ADD CONSTRAINT FK_D87FDB7D12469DE2 FOREIGN KEY (category_id) REFERENCES categories (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP TABLE mtm_series_to_categories');
    }
}
